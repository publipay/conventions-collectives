# Services de prévention et de santé au travail interentreprises — IDCC 897

> La version 2026.1 a été supprimée pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 entre en vigueur le 1er janvier 2026. Il modélise l'accord du 19 février 2026 relatif aux rémunérations minimales annuelles garanties, étendu par arrêté du 4 mai 2026.

La révision [2026.2](0897-services-prevention-sante-travail-interentreprises.2026.2.publicodes), même date d'effet, corrige `classe hors grille` : en 2026.1, la règle reposait sur `ou`, qui n'est pas un opérateur publicodes, et déclarait toutes les classes hors grille. Elle vaut désormais vrai seulement quand la classe n'a pas de montant dans la grille.

## Règles implémentées

- `classe` reçoit une classe de `A` à `M` (défaut : `non renseigné`).
- `salaire minimum annuel conventionnel` expose les 13 rémunérations minimales annuelles garanties, de 24 378 € en classe A à 86 449 € en classe M, et les prorata selon la quotité de travail.
- `classe hors grille` repère une classe absente de la grille ; le minimum vaut alors `0 €/an` et l'application doit traiter cette anomalie.

Le modèle conserve la comparaison en euros annuels et ne convertit pas le minimum en garantie mensuelle. Les indemnités de déplacement et de repas de l'avenant distinct du 19 février 2026 ne sont pas calculées automatiquement, car elles dépendent de frais et de situations de déplacement. Les garanties d'évolution liées à l'ancienneté des cadres ne sont pas évaluées automatiquement. Les références juridiques détaillées figurent dans les métadonnées du fichier Publicodes.

## Contribution conventionnelle de formation

La révision 2026.3, à la date d'effet de la version 2026.2, ajoute `formation professionnelle conventionnelle` : contribution conventionnelle de formation professionnelle de l'année 2026 : 0,35 % de la masse salariale (avenant n° 5 du 12 juin 2025), versée à l'OPCO Santé. Le montant mensuel est une provision : 0,35 % du brut du mois ; rien après 2026 (KALITEXT000052288844). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
