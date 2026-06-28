from app.services.skill_normalizer import SkillNormalizer

normalizer = SkillNormalizer()

skills = [

    "Python Skill",

    "Python",

    "Java Expert",

    "CPP",

    "C++ Expert",

    "Docker",

    "Leadership",

    "Communication"

]

print("\nNormalized Skills\n")

print(
    normalizer.normalize_list(skills)
)

print("\nNormalized With Category\n")

print(
    normalizer.normalize_with_category(skills)
)