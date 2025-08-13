import Joi from "joi";

// schema for login form validation
export const loginFormSchema = Joi.object({
  phone: Joi.string().required().messages({
    "string.pattern.base": "شماره موبایل باید با 9 شروع شده و 10 رقم باشد",
    "string.empty": "شماره موبایل الزامی است",
  }),

  password: Joi.string().min(6).max(32).required().messages({
    "string.min": "رمز عبور باید حداقل 6 کاراکتر باشد",
    "string.max": "رمز عبور نباید بیشتر از 32 کاراکتر باشد",
    "string.empty": "رمز عبور الزامی است",
  }),
});

// schema for signup form validation
export const signupFormSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "نام و نام خانوادگی الزامی است",
    "string.min": "نام باید حداقل ۳ کاراکتر باشد",
    "string.max": "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد",
  }),

  phone: Joi.string().required().messages({
    "string.pattern.base": "شماره موبایل باید با 9 شروع شده و 10 رقم باشد",
    "string.empty": "شماره موبایل الزامی است",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "ایمیل وارد شده معتبر نیست",
      "string.empty": "ایمیل الزامی است",
    }),

  password: Joi.string().min(6).max(32).required().messages({
    "string.min": "رمز عبور باید حداقل ۶ کاراکتر باشد",
    "string.max": "رمز عبور نباید بیشتر از ۳۲ کاراکتر باشد",
    "string.empty": "رمز عبور الزامی است",
  }),
});
