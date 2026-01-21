import { z } from 'zod';

/**
 * Egyptian Governorates
 * Used in address selection forms
 */
export const governorates = [
  { value: 'القاهرة', label: 'القاهرة' },
  { value: 'الجيزة', label: 'الجيزة' },
  { value: 'الإسكندرية', label: 'الإسكندرية' },
  { value: 'الدقهلية', label: 'الدقهلية' },
  { value: 'البحر الأحمر', label: 'البحر الأحمر' },
  { value: 'البحيرة', label: 'البحيرة' },
  { value: 'الفيوم', label: 'الفيوم' },
  { value: 'الغربية', label: 'الغربية' },
  { value: 'الإسماعيلية', label: 'الإسماعيلية' },
  { value: 'المنوفية', label: 'المنوفية' },
  { value: 'المنيا', label: 'المنيا' },
  { value: 'القليوبية', label: 'القليوبية' },
  { value: 'الوادي الجديد', label: 'الوادي الجديد' },
  { value: 'السويس', label: 'السويس' },
  { value: 'الشرقية', label: 'الشرقية' },
  { value: 'جنوب سيناء', label: 'جنوب سيناء' },
  { value: 'كفر الشيخ', label: 'كفر الشيخ' },
  { value: 'مطروح', label: 'مطروح' },
  { value: 'الأقصر', label: 'الأقصر' },
  { value: 'قنا', label: 'قنا' },
  { value: 'شمال سيناء', label: 'شمال سيناء' },
  { value: 'سوهاج', label: 'سوهاج' },
  { value: 'أسوان', label: 'أسوان' },
  { value: 'أسيوط', label: 'أسيوط' },
  { value: 'بني سويف', label: 'بني سويف' },
  { value: 'بورسعيد', label: 'بورسعيد' },
  { value: 'دمياط', label: 'دمياط' },
];

/**
 * Gender options
 */
export const genderOptions = [
  { value: 'ذكر', label: 'ذكر' },
  { value: 'أنثى', label: 'أنثى' },
];

/**
 * Religion options
 */
export const religionOptions = [
  { value: 'مسلم', label: 'مسلم' },
  { value: 'مسيحي', label: 'مسيحي' },
];

/**
 * Guardian relation options
 */
export const guardianRelationOptions = [
  { value: 'father', label: 'الأب' },
  { value: 'mother', label: 'الأم' },
  { value: 'brother', label: 'الأخ' },
  { value: 'uncle', label: 'العم/الخال' },
  { value: 'other', label: 'أخرى' },
];

/**
 * Secondary stream options
 */
export const secondaryStreamOptions = [
  { value: 'علمي علوم', label: 'علمي علوم' },
  { value: 'علمي رياضة', label: 'علمي رياضة' },
  { value: 'أدبي', label: 'أدبي' },
];

/**
 * Grade options
 */
export const gradeOptions = [
  { value: 'ممتاز', label: 'ممتاز' },
  { value: 'جيد جداً', label: 'جيد جداً' },
  { value: 'جيد', label: 'جيد' },
  { value: 'مقبول', label: 'مقبول' },
];

/**
 * Level/Year options
 */
export const levelOptions = [
  { value: 'الأولى', label: 'الأولى' },
  { value: 'الثانية', label: 'الثانية' },
  { value: 'الثالثة', label: 'الثالثة' },
  { value: 'الرابعة', label: 'الرابعة' },
  { value: 'الخامسة', label: 'الخامسة' },
  { value: 'السادسة', label: 'السادسة' },
];

/**
 * Contact info schema (for father and guardian)
 */
const contactInfoSchema = z.object({
  fullName: z.string().min(3, 'الاسم الكامل مطلوب (3 أحرف على الأقل)'),
  nationalId: z.string()
    .min(1, 'الرقم القومي مطلوب')
    .regex(/^[0-9]{14}$/, 'الرقم القومي يجب أن يكون 14 رقم بالضبط'),
  relation: z.string().optional(),
  job: z.string().min(1, 'الوظيفة مطلوبة'),
  phoneNumber: z.string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(/^01[0-9]{9}$/, 'رقم الهاتف يجب أن يكون 11 رقم يبدأ بـ 01'),
  address: z.string().min(5, 'العنوان مطلوب (5 أحرف على الأقل)'),
});

/**
 * Student info schema
 */
const studentInfoSchema = z.object({
  nationalId: z.string()
    .min(1, 'الرقم القومي مطلوب')
    .regex(/^[0-9]{14}$/, 'الرقم القومي يجب أن يكون 14 رقم بالضبط'),
  fullName: z.string().min(3, 'الاسم الكامل مطلوب (3 أحرف على الأقل)'),
  birthDate: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  birthPlace: z.string().min(1, 'محل الميلاد مطلوب'),
  gender: z.string().min(1, 'النوع مطلوب'),
  religion: z.string().min(1, 'الديانة مطلوبة'),
  governorate: z.string().min(1, 'المحافظة مطلوبة'),
  city: z.string().min(1, 'المدينة مطلوبة'),
  address: z.string().min(5, 'العنوان التفصيلي مطلوب (5 أحرف على الأقل)'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(/^01[0-9]{9}$/, 'رقم الهاتف يجب أن يكون 11 رقم يبدأ بـ 01'),
  faculty: z.string().min(1, 'الكلية مطلوبة'),
  department: z.string().min(1, 'القسم مطلوب'),
  level: z.string().min(1, 'المستوى الدراسي مطلوب'),
});

/**
 * Secondary info schema (for new students)
 */
const secondaryInfoSchema = z.object({
  secondaryStream: z.string().min(1, 'الشعبة مطلوبة'),
  totalScore: z.string().min(1, 'المجموع الكلي مطلوب'),
  percentage: z.string().min(1, 'النسبة المئوية مطلوبة'),
  grade: z.string().min(1, 'التقدير مطلوب'),
});

/**
 * Academic info schema (for old students)
 */
const academicInfoSchema = z.object({
  currentGPA: z.string().min(1, 'المعدل التراكمي مطلوب'),
  lastYearGrade: z.string().min(1, 'تقدير العام السابق مطلوب'),
});

/**
 * Validation schema for new student housing application form
 */
export const newStudentApplicationSchema = z.object({
  // Student Info
  studentInfo: studentInfoSchema,
  // Father Info
  fatherInfo: contactInfoSchema,
  // Guardian selection
  selectedGuardianRelation: z.string().min(1, 'علاقة ولي الأمر مطلوبة'),
  // Other Guardian Info (optional - only when guardian is not father)
  otherGuardianInfo: contactInfoSchema.optional(),
  // Secondary Info (for new students)
  secondaryInfo: secondaryInfoSchema,
  // Academic Info
  academicInfo: academicInfoSchema,
});

/**
 * Validation schema for old student housing application form
 */
export const oldStudentApplicationSchema = z.object({
  // Student Info
  studentInfo: studentInfoSchema,
  // Father Info
  fatherInfo: contactInfoSchema,
  // Guardian selection
  selectedGuardianRelation: z.string().min(1, 'علاقة ولي الأمر مطلوبة'),
  // Other Guardian Info (optional - only when guardian is not father)
  otherGuardianInfo: contactInfoSchema.optional(),
  // Academic Info (for old students)
  academicInfo: academicInfoSchema,
});

export type NewStudentApplicationFormData = z.infer<typeof newStudentApplicationSchema>;
export type OldStudentApplicationFormData = z.infer<typeof oldStudentApplicationSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Keep legacy types for backward compatibility
export const applicationSchema = newStudentApplicationSchema;
export type ApplicationFormData = NewStudentApplicationFormData;
