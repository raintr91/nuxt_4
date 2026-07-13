import path from 'node:path'
import { access } from 'node:fs/promises'

import { toKebab } from './read-spec.mjs'

const SCALAR_TS = {
  integer: 'number',
  int: 'number',
  number: 'number',
  float: 'number',
  boolean: 'boolean',
  datetime: 'Date',
  date: 'Date',
  string: 'string',
  text: 'string'
}

const SCALAR_COLUMN = {
  integer: 'int',
  int: 'int',
  number: 'int',
  float: 'float',
  boolean: 'boolean',
  datetime: 'timestamp',
  date: 'date',
  string: 'varchar',
  text: 'text'
}

function resolveEntityNode(spec, ctx) {
  const moduleNode =
    spec.modules?.find((m) => m.name === ctx.module) ?? spec.modules?.[0]
  const entityNode =
    moduleNode?.entities?.find((e) => e.name === ctx.entity) ?? moduleNode?.entities?.[0]
  return { moduleNode, entityNode }
}

function normalizeField(field) {
  const key = field.key ?? field.name
  if (!key) return null
  return {
    key,
    type: field.type ?? 'string',
    readOnly: Boolean(field.readOnly ?? field.read_only),
    nullable: field.nullable !== false && key !== 'id'
  }
}

export function buildOrmContext(spec, ctx, repoRoot) {
  const { entityNode } = resolveEntityNode(spec, ctx)
  const tableName = entityNode?.table ?? `${toKebab(ctx.entity)}s`
  const rawFields = (entityNode?.fields ?? []).map(normalizeField).filter(Boolean)
  const rawRelations = entityNode?.relationships ?? []

  const ormColumns = []
  const seen = new Set()

  for (const field of rawFields) {
    if (field.key === 'id') {
      ormColumns.push({
        key: 'id',
        property: 'id',
        tsType: 'number',
        decorators: ['@PrimaryGeneratedColumn()'],
        comment: null
      })
      seen.add('id')
      continue
    }

    const colType = SCALAR_COLUMN[field.type] ?? 'varchar'
    const tsType = SCALAR_TS[field.type] ?? 'string'
    const decorators = [`@Column({ type: '${colType}', nullable: ${field.nullable} })`]

    ormColumns.push({
      key: field.key,
      property: field.key,
      fieldType: field.type,
      tsType: field.nullable ? `${tsType} | null` : tsType,
      decorators,
      comment: field.readOnly ? 'read-only in contract' : null
    })
    seen.add(field.key)
  }

  if (!seen.has('id')) {
    ormColumns.unshift({
      key: 'id',
      property: 'id',
      tsType: 'number',
      decorators: ['@PrimaryGeneratedColumn()'],
      comment: 'default PK'
    })
  }

  if (!seen.has('created_at')) {
    ormColumns.push({
      key: 'created_at',
      property: 'created_at',
      fieldType: 'datetime',
      tsType: 'Date | null',
      decorators: ["@Column({ type: 'timestamp', nullable: true })"],
      comment: null
    })
  }

  if (!seen.has('updated_at')) {
    ormColumns.push({
      key: 'updated_at',
      property: 'updated_at',
      fieldType: 'datetime',
      tsType: 'Date | null',
      decorators: ["@Column({ type: 'timestamp', nullable: true })"],
      comment: null
    })
  }

  const ormRelations = rawRelations.map((rel) => ({
    field: rel.name ?? rel.field,
    type: rel.type ?? rel.persistence?.type ?? 'relation',
    target: rel.target ?? rel.targetEntity ?? 'Entity',
    writable: rel.writable !== false,
    cardinality: rel.cardinality ?? (rel.type === 'hasMany' ? 'many' : 'one')
  }))

  const prismaTypeMap = {
    integer: 'Int',
    int: 'Int',
    number: 'Int',
    float: 'Float',
    boolean: 'Boolean',
    datetime: 'DateTime',
    date: 'DateTime',
    string: 'String',
    text: 'String'
  }

  const prismaFields = ormColumns.map((col) => ({
    name: col.property,
    prismaType:
      col.property === 'id'
        ? 'Int'
        : (prismaTypeMap[col.fieldType] ?? 'String'),
    optional:
      col.property === 'id'
        ? ' @id @default(autoincrement())'
        : col.tsType.includes('null')
          ? '?'
          : ''
  }))

  const prismaRelations = ormRelations.map((rel) => {
    const isMany = rel.type === 'hasMany' || rel.cardinality === 'many'
    return {
      field: rel.field,
      target: rel.target,
      relationSuffix: isMany ? '[]' : '?'
    }
  })

  return {
    tableName,
    ormColumns,
    ormRelations,
    prismaFields,
    prismaRelations,
    relationshipsMetaImport: resolveRelationshipsMetaImport(ctx, repoRoot)
  }
}

function resolveRelationshipsMetaImport(ctx, repoRoot) {
  const entityKebab = toKebab(ctx.entity)
  const relative = `packages/models/src/${entityKebab}/${entityKebab}.relationships.meta.ts`
  const abs = path.join(repoRoot, relative)
  return access(abs).then(
    () => `@portal/models/${entityKebab}/${entityKebab}.relationships.meta`,
    () => null
  )
}

export async function enrichPlanContext(spec, ctx, repoRoot) {
  const orm = buildOrmContext(spec, ctx, repoRoot)
  const relationshipsMetaImport = await orm.relationshipsMetaImport
  return { ...ctx, ...orm, relationshipsMetaImport }
}
