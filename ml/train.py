import os
import joblib
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from xgboost import XGBClassifier

def train_model():
    print("Starting RecruitIQ ML Model Training...")
    
    # 1. Resolve paths
    project_root = Path(__file__).resolve().parent.parent
    dataset_file = project_root / "backend" / "app" / "datasets" / "matching_dataset.csv"
    models_dir = project_root / "backend" / "app" / "models"
    
    if not dataset_file.exists():
        raise FileNotFoundError(f"Training dataset not found at: {dataset_file}")
        
    os.makedirs(models_dir, exist_ok=True)
    
    # 2. Load dataset
    print(f"Loading dataset from: {dataset_file}")
    df = pd.read_csv(dataset_file)
    
    # 3. Define features and label
    feature_columns = [
        "matched_skill_count",
        "missing_skill_count",
        "resume_skill_count",
        "job_skill_count",
        "skill_overlap_ratio",
        "experience_gap",
        "education_gap",
        "project_match_count",
        "certification_match_count",
        "retrieval_score",
        "title_similarity",
        "keyword_similarity",
        "technical_job_score"
    ]
    
    X = df[feature_columns]
    y = df["label"]
    
    # 4. Split dataset into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Dataset Split: Train={len(X_train)} samples, Test={len(X_test)} samples")
    
    # 5. Train XGBoost classifier
    print("Training XGBoost Classifier...")
    model = XGBClassifier(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
        eval_metric="logloss"
    )
    model.fit(X_train, y_train)
    
    # 6. Evaluate model
    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:, 1]
    
    accuracy = accuracy_score(y_test, predictions)
    precision = precision_score(y_test, predictions)
    recall = recall_score(y_test, predictions)
    f1 = f1_score(y_test, predictions)
    roc_auc = roc_auc_score(y_test, probabilities)
    conf_mat = confusion_matrix(y_test, predictions)
    
    print("\n" + "="*40)
    print("MODEL PERFORMANCE METRICS")
    print("="*40)
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print(f"ROC-AUC:   {roc_auc:.4f}")
    print("\nConfusion Matrix:")
    print(conf_mat)
    print("="*40 + "\n")
    
    # 7. Save model and column features list
    model_path = models_dir / "xgboost_model.pkl"
    columns_path = models_dir / "feature_columns.pkl"
    
    print(f"Saving model to: {model_path}")
    joblib.dump(model, model_path)
    
    print(f"Saving feature column schema to: {columns_path}")
    joblib.dump(feature_columns, columns_path)
    
    print("Model training pipeline execution completed successfully!")

if __name__ == "__main__":
    train_model()
