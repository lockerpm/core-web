import { CipherType } from "../../core-js/src/enums";

const checkPasswordPolicy = (
  password,
  policy
) => {
  const violations = []
  if (!policy || !password) {
    return []
  }
  if (policy?.enabled && policy?.config) {
    if (policy.config.minLength && password.length < policy.config.minLength) {
      violations.push({ key: 'minLength', value: policy.config.minLength })
    }
    if (policy.config.requireSpecialCharacter) {
      const reg = /(?=.*[!@#$%^&*])/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key: 'requireSpecialCharacter' })
      }
    }
    if (policy.config.requireLowerCase) {
      const reg = /[a-z]/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key: 'requireLowerCase' })
      }
    }
    if (policy.config.requireUpperCase) {
      const reg = /[A-Z]/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key: 'requireUpperCase' })
      }
    }
    if (policy.config.requireDigit) {
      const reg = /[1-9]/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key:  'requireDigit' })
      }
    }
  }
  return violations
}

const violatedPasswordCiphers = (allCiphers, policy) => {
  const violatedCiphers = []
  allCiphers.forEach(c => {
    if (
      c.type !== CipherType.Login ||
      c.login.password == null ||
      c.login.password === '' ||
      c.isDeleted
    ) {
      return
    }
    const violations = checkPasswordPolicy(
      c.login.password || '',
      policy
    ) || []
    if (violations.length) {
      violatedCiphers.push({
        ...c,
        violations
      })
    }
  })
  return violatedCiphers
}

export default {
  checkPasswordPolicy,
  violatedPasswordCiphers
}