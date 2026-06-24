# Dataset Information

Generated for the datasets currently present in `D:\Projects\RecruitIQ\dataset`.

## Overall Summary

| Item | Value |
|---|---:|
| Root dataset folder | `dataset` |
| Total files | 2,497 |
| Total size | 678,247,561 bytes, about 646.83 MiB |
| CSV files | 13 |
| PDF files | 2,484 |

## Dataset Folders

| Folder | Main contents | Files | Size |
|---|---|---:|---:|
| `dataset\Job Postings Dataset` | LinkedIn-style job postings, companies, salaries, benefits, skills, and industry mappings | 11 | 556,502,912 bytes, about 530.72 MiB |
| `dataset\Resume_dataset` | Resume text/html metadata plus PDF resume files grouped by category | 2,485 | 118,289,355 bytes, about 112.81 MiB |
| `dataset\skills` | Standalone cleaned skill label dataset | 1 | 3,455,294 bytes, about 3.30 MiB |

## File Types

| Extension | Files | Size |
|---|---:|---:|
| `.csv` | 13 | 616,231,441 bytes, about 587.68 MiB |
| `.pdf` | 2,484 | 62,016,120 bytes, about 59.14 MiB |

## CSV Dataset Inventory

Parsed row counts were calculated with a CSV parser, so quoted multiline text fields are handled correctly.

| File | Parsed rows | Columns | Size | Purpose |
|---|---:|---:|---:|---|
| `dataset\Job Postings Dataset\postings.csv` | 123,849 | 31 | 516,843,769 bytes | Main job posting table with job descriptions, salary fields, work type, location, company link, application URLs, posting timestamps, and normalized salary. |
| `dataset\Job Postings Dataset\companies\companies.csv` | 24,473 | 10 | 23,196,843 bytes | Company profile table linked by `company_id`. |
| `dataset\Job Postings Dataset\companies\company_industries.csv` | 24,375 | 2 | 782,404 bytes | Company-to-industry mapping table. |
| `dataset\Job Postings Dataset\companies\company_specialities.csv` | 169,387 | 2 | 4,431,117 bytes | Company-to-speciality mapping table. |
| `dataset\Job Postings Dataset\companies\employee_counts.csv` | 35,787 | 4 | 1,044,625 bytes | Company employee and follower count snapshots. |
| `dataset\Job Postings Dataset\jobs\benefits.csv` | 67,943 | 3 | 1,925,812 bytes | Job benefit records linked by `job_id`. |
| `dataset\Job Postings Dataset\jobs\job_industries.csv` | 164,808 | 2 | 2,506,014 bytes | Job-to-industry mapping table. |
| `dataset\Job Postings Dataset\jobs\job_skills.csv` | 213,768 | 2 | 3,506,651 bytes | Job-to-skill abbreviation mapping table. |
| `dataset\Job Postings Dataset\jobs\salaries.csv` | 40,785 | 8 | 2,252,264 bytes | Structured salary records linked by `job_id`. |
| `dataset\Job Postings Dataset\mappings\industries.csv` | 422 | 2 | 12,734 bytes | Industry ID lookup table. |
| `dataset\Job Postings Dataset\mappings\skills.csv` | 35 | 2 | 679 bytes | Skill abbreviation lookup table. |
| `dataset\Resume_dataset\Resume\Resume.csv` | 2,484 | 4 | 56,273,235 bytes | Resume metadata/text table containing plain text resume content, HTML resume content, and category labels. |
| `dataset\skills\skills.csv` | 13,893 | 2 | 3,455,294 bytes | Cleaned skill labels with alternate labels. |

## CSV Schemas

### Job Postings Dataset

`dataset\Job Postings Dataset\postings.csv`

Columns: `job_id`, `company_name`, `title`, `description`, `max_salary`, `pay_period`, `location`, `company_id`, `views`, `med_salary`, `min_salary`, `formatted_work_type`, `applies`, `original_listed_time`, `remote_allowed`, `job_posting_url`, `application_url`, `application_type`, `expiry`, `closed_time`, `formatted_experience_level`, `skills_desc`, `listed_time`, `posting_domain`, `sponsored`, `work_type`, `currency`, `compensation_type`, `normalized_salary`, `zip_code`, `fips`

`dataset\Job Postings Dataset\companies\companies.csv`

Columns: `company_id`, `name`, `description`, `company_size`, `state`, `country`, `city`, `zip_code`, `address`, `url`

`dataset\Job Postings Dataset\companies\company_industries.csv`

Columns: `company_id`, `industry`

`dataset\Job Postings Dataset\companies\company_specialities.csv`

Columns: `company_id`, `speciality`

`dataset\Job Postings Dataset\companies\employee_counts.csv`

Columns: `company_id`, `employee_count`, `follower_count`, `time_recorded`

`dataset\Job Postings Dataset\jobs\benefits.csv`

Columns: `job_id`, `inferred`, `type`

`dataset\Job Postings Dataset\jobs\job_industries.csv`

Columns: `job_id`, `industry_id`

`dataset\Job Postings Dataset\jobs\job_skills.csv`

Columns: `job_id`, `skill_abr`

`dataset\Job Postings Dataset\jobs\salaries.csv`

Columns: `salary_id`, `job_id`, `max_salary`, `med_salary`, `min_salary`, `pay_period`, `currency`, `compensation_type`

`dataset\Job Postings Dataset\mappings\industries.csv`

Columns: `industry_id`, `industry_name`

`dataset\Job Postings Dataset\mappings\skills.csv`

Columns: `skill_abr`, `skill_name`

### Resume Dataset

`dataset\Resume_dataset\Resume\Resume.csv`

Columns: `ID`, `Resume_str`, `Resume_html`, `Category`

The same 2,484 resumes also exist as PDF files under `dataset\Resume_dataset\data\data`, grouped into category folders.

### Standalone Skills Dataset

`dataset\skills\skills.csv`

Columns: `label_cleaned`, `altLabels`

## Resume PDF Category Counts

The PDF category folder counts match the parsed category counts in `Resume.csv`.

| Category | PDF files | Size |
|---|---:|---:|
| `ACCOUNTANT` | 118 | 3,025,850 bytes |
| `ADVOCATE` | 118 | 2,988,241 bytes |
| `AGRICULTURE` | 63 | 1,635,392 bytes |
| `APPAREL` | 97 | 2,403,582 bytes |
| `ARTS` | 103 | 2,539,592 bytes |
| `AUTOMOBILE` | 36 | 898,816 bytes |
| `AVIATION` | 117 | 2,855,096 bytes |
| `BANKING` | 115 | 2,859,110 bytes |
| `BPO` | 22 | 581,041 bytes |
| `BUSINESS-DEVELOPMENT` | 120 | 2,928,309 bytes |
| `CHEF` | 118 | 2,891,870 bytes |
| `CONSTRUCTION` | 112 | 2,881,175 bytes |
| `CONSULTANT` | 115 | 3,033,136 bytes |
| `DESIGNER` | 107 | 2,551,595 bytes |
| `DIGITAL-MEDIA` | 96 | 2,367,077 bytes |
| `ENGINEERING` | 118 | 2,950,123 bytes |
| `FINANCE` | 118 | 2,991,717 bytes |
| `FITNESS` | 117 | 2,756,882 bytes |
| `HEALTHCARE` | 115 | 2,933,573 bytes |
| `HR` | 110 | 2,800,523 bytes |
| `INFORMATION-TECHNOLOGY` | 120 | 3,148,516 bytes |
| `PUBLIC-RELATIONS` | 111 | 2,921,517 bytes |
| `SALES` | 116 | 2,678,992 bytes |
| `TEACHER` | 102 | 2,394,395 bytes |

## Relationship Notes

- `postings.csv` is the central job table. It links to job-level tables through `job_id`.
- `companies.csv` is the central company table. It links to company-level tables through `company_id`.
- `job_skills.csv` uses `skill_abr`, which can be decoded through `mappings\skills.csv`.
- `job_industries.csv` uses `industry_id`, which can be decoded through `mappings\industries.csv`.
- `salaries.csv`, `benefits.csv`, `job_skills.csv`, and `job_industries.csv` are many-to-one or many-to-many support tables for job postings.
- `Resume.csv` contains one row per resume and includes both extracted plain text and HTML. The PDF files provide the original resume documents in category folders.
- `dataset\skills\skills.csv` appears to be separate from the job posting skill abbreviation mapping. It contains broader cleaned skill labels and alternate labels.

## Data Quality Notes

- Several CSV files contain large quoted text fields, especially `postings.csv` and `Resume.csv`. Use a proper CSV parser instead of splitting lines by commas.
- `Resume.csv` has multiline text/html fields. Physical line counts are much higher than parsed row counts; the correct parsed row count is 2,484.
- The resume dataset is balanced by category in the sense that most classes have roughly 100-120 resumes, but smaller categories exist, such as `BPO` with 22 and `AUTOMOBILE` with 36.
- The job postings dataset is the largest part of the workspace by size, mostly due to `postings.csv`.
