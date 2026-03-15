
from datetime import datetime
from .models import ExamAttempt, Violation
from apps.users.models import User

def save_violation(exam_id, student_cid, violation_type, screenshot):
    print("🔥 SAVE VIOLATION CALLED:", exam_id, student_cid, violation_type)
    student = User.objects(cId=student_cid).first()

    if not student:
        print("❌ Student not found:", student_cid)
        return
    
    attempt = ExamAttempt.objects(
        exam = exam_id,
        student = student
    ).first()

    if not attempt:
        attempt = ExamAttempt(
            exam = exam_id,
            student = student,
            violations = []
        )

    for v in attempt.violations:
        if v.type == violation_type:
            v.count += 1
            v.timestamp = datetime.utcnow()

            if screenshot:
                v.screenshots.append(screenshot)

            attempt.save()
            return
        
    attempt.violations.append(
        Violation(
            type=violation_type,
            count = 1,
            screenshots = [screenshot],
            timestamp = datetime.utcnow()
        )
    )
    attempt.save()
    
