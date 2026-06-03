<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import type { LoginRequest } from '~/types/api/auth'
import { useAuthLoginForm } from '~/composables/auth/useAuthLoginForm'
import { loginSchema } from '~/validations/auth/schemas'
import { applyValidationErrorsToForm } from '~/utils/apiValidation'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

const { apiError, isSubmitting, onSubmit: submitLogin } = useAuthLoginForm()

const { handleSubmit, errors, setErrors } = useForm<LoginRequest>({
  validationSchema: loginSchema,
  initialValues: { email: '', password: '' }
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await submitLogin(values)
  } catch (e) {
    if (applyValidationErrorsToForm(e, setErrors)) return
    // Non-validation errors are already surfaced via apiError ref
    // from useAuthLoginForm — no further action needed here.
  }
})
</script>

<template>
  <div class="bg-white">
    <div class="bg-[#E3CD00] py-[50px]" style="padding-left:clamp(20px,8vw,160px);padding-right:clamp(20px,8vw,160px)">
      <div class="bg-white px-[25px]">
        <form class="flex items-center" @submit.prevent="onSubmit">
          <!-- Logo col -->
          <div class="flex shrink-0 items-center justify-center py-[30px] pr-6" style="width:150px">
            <img src="/img/logo_white.svg" alt="mairy" style="height:70px;width:auto;max-width:130px" />
          </div>

          <!-- Fields col -->
          <div class="py-[30px] pr-6">
            <div v-if="apiError" class="mb-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ apiError }}
            </div>

            <div class="mb-3">
              <input
                v-model="email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="ログインID"
                required
                class="border border-gray-300 px-3"
                :class="errors.email ? 'border-red-400 bg-[#FDDDDD]' : ''"
                style="width:230px;height:44px;font-size:15px"
              />
            </div>

            <div class="mb-3">
              <input
                v-model="password"
                type="password"
                name="password"
                autocomplete="current-password"
                placeholder="パスワード"
                required
                class="border border-gray-300 px-3"
                :class="errors.password ? 'border-red-400 bg-[#FDDDDD]' : ''"
                style="width:230px;height:44px;font-size:15px"
              />
            </div>

            <div v-if="errors.email || errors.password" class="mb-2 text-sm text-red-600">
              {{ errors.email || errors.password }}
            </div>

            <p class="text-gray-600" style="font-size:14px">
              ※当システムでは全ての通信に対してHTTPS（SSL/TLS）暗号化を採用しております。
            </p>
          </div>

          <!-- Button + forgot -->
          <div class="flex shrink-0 flex-col items-center justify-center gap-3 py-[30px]" style="width:180px">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-[0.7rem] text-white disabled:opacity-60"
              style="background-color:#4EAAFF;font-size:18px"
            >
              {{ isSubmitting ? 'ログイン中...' : 'ログイン' }}
            </button>
            <NuxtLink to="/password/reset" class="whitespace-nowrap text-[#4EAAFF] underline" style="font-size:16px">
              パスワードお忘れの方はこちら
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
