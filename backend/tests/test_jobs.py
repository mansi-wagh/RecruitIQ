import pytest


def test_jobs_crud_and_authorization(client, db_session):
    client.post(
        "/auth/register",
        json={
            "name": "Candidate Charlie",
            "email": "charlie@candidate.com",
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

    cand_token = client.post(
        "/auth/login",
        json={"email": "charlie@candidate.com", "password": "Password123"}
    ).json()["access_token"]
    
    hr_token = client.post(
        "/auth/login",
        json={"email": "helen@hr.com", "password": "Password123"}
    ).json()["access_token"]

    cand_headers = {"Authorization": f"Bearer {cand_token}"}
    create_fail = client.post(
        "/jobs/",
        headers=cand_headers,
        json={
            "title": "Software Engineer",
            "department": "Engineering",
            "required_skills": "Python, FastApi",
            "experience_required": "2+ years"
        }
    )
    assert create_fail.status_code == 403

    hr_headers = {"Authorization": f"Bearer {hr_token}"}
    create_success = client.post(
        "/jobs/",
        headers=hr_headers,
        json={
            "title": "Data Scientist",
            "department": "AI/ML",
            "location": "Remote",
            "employment_type": "Full-time",
            "description": "Looking for data scientist.",
            "required_skills": "Python, SQL, PyTorch",
            "experience_required": "3+ years"
        }
    )
    assert create_success.status_code == 201
    job_data = create_success.json()
    assert job_data["title"] == "Data Scientist"
    job_id = job_data["id"]

    jobs_response = client.get("/jobs/", headers=cand_headers)
    assert jobs_response.status_code == 200
    assert len(jobs_response.json()) >= 1
    assert jobs_response.json()[0]["id"] == job_id

    job_detail = client.get(f"/jobs/{job_id}", headers=cand_headers)
    assert job_detail.status_code == 200
    assert job_detail.json()["title"] == "Data Scientist"

    update_response = client.put(
        f"/jobs/{job_id}",
        headers=hr_headers,
        json={
            "title": "Senior Data Scientist",
            "location": "Hybrid"
        }
    )
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Senior Data Scientist"
    assert update_response.json()["location"] == "Hybrid"

    delete_response = client.delete(f"/jobs/{job_id}", headers=hr_headers)
    assert delete_response.status_code == 200
    
    not_found = client.get(f"/jobs/{job_id}", headers=hr_headers)
    assert not_found.status_code == 404
