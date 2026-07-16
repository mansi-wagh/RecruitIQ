import pytest
from app.models.job import Job
from app.models.user import User
from app.models.resume import Resume


def test_job_application_flow(client, db_session):
    client.post(
        "/auth/register",
        json={
            "name": "Candidate Donald",
            "email": "donald@candidate.com",
            "password": "Password123",
            "role": "candidate"
        }
    )
    client.post(
        "/auth/register",
        json={
            "name": "HR Helen",
            "email": "helen@hr.com",
            "password": "Password123",
            "role": "hr"
        }
    )

    cand_login = client.post(
        "/auth/login",
        json={"email": "donald@candidate.com", "password": "Password123"}
    ).json()
    cand_token = cand_login["access_token"]
    
    hr_token = client.post(
        "/auth/login",
        json={"email": "helen@hr.com", "password": "Password123"}
    ).json()["access_token"]

    cand_headers = {"Authorization": f"Bearer {cand_token}"}
    hr_headers = {"Authorization": f"Bearer {hr_token}"}

    create_job_res = client.post(
        "/jobs/",
        headers=hr_headers,
        json={
            "title": "Python Developer",
            "department": "Engineering",
            "required_skills": "Python, Django, SQL",
            "experience_required": "2+ years"
        }
    )
    job_id = create_job_res.json()["id"]

    candidate = db_session.query(User).filter(User.email == "donald@candidate.com").first()
    resume_rec = Resume(user_id=candidate.id, resume_path="uploads/resumes/mock_resume.pdf")
    db_session.add(resume_rec)
    db_session.commit()

    apply_res = client.post(
        "/applications/",
        headers=cand_headers,
        json={"job_id": job_id}
    )
    assert apply_res.status_code == 201
    app_data = apply_res.json()
    assert app_data["job_id"] == job_id
    assert app_data["status"] == "Under review"
    
    apply_dup = client.post(
        "/applications/",
        headers=cand_headers,
        json={"job_id": job_id}
    )
    assert apply_dup.status_code == 400
    assert apply_dup.json()["detail"] == "You have already applied to this job"

    my_apps = client.get("/applications/", headers=cand_headers)
    assert my_apps.status_code == 200
    assert len(my_apps.json()) == 1

    all_apps = client.get("/applications/hr", headers=hr_headers)
    assert all_apps.status_code == 200
    assert len(all_apps.json()) >= 1
