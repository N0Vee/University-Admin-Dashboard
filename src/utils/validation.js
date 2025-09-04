import { z } from 'zod'

// Student validation schema
export const studentValidationSchema = z.object({
  title: z.string().min(1, 'กรุณาเลือกคำหน้าชื่อ'),
  titleEng: z.string().optional(),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ (ภาษาไทย)'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล (ภาษาไทย)'),
  firstNameEng: z.string().min(1, 'กรุณากรอกชื่อ (ภาษาอังกฤษ)'),
  lastNameEng: z.string().min(1, 'กรุณากรอกนามสกุล (ภาษาอังกฤษ)'),
  studentId: z.string().optional(),
  email: z.string().optional(),
  idCard: z.string().regex(/^\d{13}$/, 'เลขบัตรประชาชนต้องมี 13 หลัก'),
  phone: z.string().regex(/^[0-9]{10}$/, 'เบอร์โทรศัพท์ต้องมี 10 หลัก'),
  birthDate: z.string().min(1, 'กรุณาเลือกวันเกิด'),
  faculty: z.string().min(1, 'กรุณาเลือกคณะ'),
  major: z.string().min(1, 'กรุณากรอกสาขาวิชา'),
  yearLevel: z.string().min(1, 'กรุณาเลือกชั้นปี'),
  enrollmentType: z.string().min(1, 'กรุณาเลือกประเภทการเรียน'),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  profileImage: z.any().optional()
})

// Course validation schema
export const courseValidationSchema = z.object({
  courseCode: z.string().min(1, 'กรุณากรอกรหัสวิชา'),
  courseName: z.string().min(1, 'กรุณากรอกชื่อวิชา (ภาษาไทย)'),
  courseNameEn: z.string().min(1, 'กรุณากรอกชื่อวิชา (ภาษาอังกฤษ)'),
  credits: z.string().min(1, 'กรุณากรอกจำนวนหน่วยกิต'),
  semester: z.string().min(1, 'กรุณาเลือกภาคเรียน'),
  faculty: z.string().min(1, 'กรุณาเลือกคณะ'),
  department: z.string().min(1, 'กรุณาเลือกภาควิชา'),
  instructor: z.string().min(1, 'กรุณากรอกชื่ออาจารย์ผู้สอน'),
  maxStudents: z.string().min(1, 'กรุณากรอกจำนวนนักศึกษาสูงสุด'),
  status: z.string().min(1, 'กรุณาเลือกสถานะ'),
  schedule: z.array(z.any()).optional(),
  objectives: z.array(z.string()).optional(),
  description: z.string().optional()
})

// Generic validation function
export const validateFormData = (schema, formData, setError) => {
  try {
    schema.parse(formData)
    setError('')
    return true
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.issues.map(issue => issue.message)
      setError(errorMessages.join(', '))
    } else {
      setError('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล')
    }
    return false
  }
}
