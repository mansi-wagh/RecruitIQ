import pytest
from app.models.user import User


def test_register_login_flow(client, db_session):
    reg_response = client.post(
        "/auth/register",
        json={
            "name": "Candidate Alice",
            "email": "alice@example.com",
            "password": "Password123",
            "role": "candidate"
        }
    )
    assert reg_response.status_code == 200
    data = reg_response.json()
    assert data["email"] == "alice@example.com"
    assert data["role"] == "candidate"
    assert "password" not in data
    
    dup_response = client.post(
        "/auth/register",
        json={
            "name": "Another Alice",
            "email": "alice@example.com",
            "password": "Password123",
            "role": "candidate"
        }
    )
    assert dup_response.status_code == 400
    assert dup_response.json()["detail"] == "Email already registered"

    login_response = client.post(
        "/auth/login",
        json={
            "email": "alice@example.com",
            "password": "Password123"
        }
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    wrong_login = client.post(
        "/auth/login",
        json={
            "email": "alice@example.com",
            "password": "WrongPassword"
        }
    )
    assert wrong_login.status_code == 401


def test_register_validation(client):
    short_pw = client.post(
        "/auth/register",
        json={
            "name": "Alice",
            "email": "alice2@example.com",
            "password": "short",
            "role": "candidate"
        }
    )
    assert short_pw.status_code == 422
    
    invalid_role = client.post(
        "/auth/register",
        json={
            "name": "Alice",
            "email": "alice2@example.com",
            "password": "Password123",
            "role": "invalid_role"
        }
    )
    assert invalid_role.status_code == 422


def test_get_current_user(client, db_session):
    client.post(
        "/auth/register",
        json={
            "name": "Bob HR",
            "email": "bob@example.com",
            "password": "Password123",
            "role": "hr"
        }
    )
    login_response = client.post(
        "/auth/login",
        json={
            "email": "bob@example.com",
            "password": "Password123"
        }
    )
    token = login_response.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    profile_response = client.get("/auth/me", headers=headers)
    assert profile_response.status_code == 200
    profile_data = profile_response.json()
    assert profile_data["email"] == "bob@example.com"
    assert profile_data["role"] == "hr"
