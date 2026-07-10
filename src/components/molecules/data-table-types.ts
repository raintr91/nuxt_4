export interface DataTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  overflow?: 'nowrap' | 'truncate-tooltip' | 'wrap-2-lines' | 'wrap-free';
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
}
