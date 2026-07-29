# SmartDoc ML Model Evaluation Report

## Summary

| Metric | Value |
|--------|-------|
| Total Samples | 19 |
| Overall Accuracy | 0.9474 (94.7%) |
| CV Mean Accuracy | 0.5794 |
| CV Std Dev | 0.0683 |
| Model Type | Pipeline |
| Categories | HR, IT, Finance |

## Classification Report

```
              precision    recall  f1-score   support

          HR       1.00      0.86      0.92         7
          IT       0.86      1.00      0.92         6
     Finance       1.00      1.00      1.00         6

    accuracy                           0.95        19
   macro avg       0.95      0.95      0.95        19
weighted avg       0.95      0.95      0.95        19

```

## Cross-Validation Scores

| Fold | Accuracy |
|------|----------|
| 1 | 0.5714 |
| 2 | 0.5000 |
| 3 | 0.6667 |
| **Mean** | **0.5794** |

## Artefacts

- `confusion_matrix.png` — Confusion matrix heatmap
- `cv_scores.png` — Per-fold cross-validation accuracy chart
- `roc_curve.png` — Multi-class ROC curves and AUC scores
