# Immobilier — IDCC 1527

> Les versions 2026.1, 2026.2 et 2026.3 ont été supprimées pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.
>
> La version 2026.4 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Modèle `1527-immobilier`, versions `2026.1` et `2026.2`, espace de noms
`salarié . convention collective . immobilier`.

## Périmètre

Convention collective nationale de l'immobilier, administrateurs de biens, sociétés
immobilières, agents immobiliers (9 septembre 1988). Les deux versions portent la grille de
l'avenant n° 111 du 24 juin 2026, applicable au **1er juin 2026** (étendu par arrêté du
7 septembre 2026, JORF du 19 septembre 2026).

La version `2026.2` remplace `2026.1` pour la même date d'effet : elle corrige la prime
d'ancienneté, proratise le minimum par la quotité de travail et ajoute `niveau hors grille`.

## Grille (annuel sur 13 mois, hors prime d'ancienneté)

| Niveau | Annuel | Mensuel (annuel / 13) |
|---|---:|---:|
| E1 | 24 272 € | 1 867,08 € |
| E2 | 24 428 € | 1 879,08 € |
| E3 | 25 080 € | 1 929,23 € |
| AM1 | 25 569 € | 1 966,85 € |
| AM2 | 26 415 € | 2 031,92 € |
| C1 | 28 333 € | 2 179,46 € |
| C2 | 36 932 € | 2 840,92 € |
| C3 | 44 221 € | 3 401,62 € |
| C4 | 49 800 € | 3 830,77 € |

`niveau` vaut `'E1'`, `'E2'`, `'E3'`, `'AM1'`, `'AM2'`, `'C1'`, `'C2'`, `'C3'` ou `'C4'`. Un niveau
absent ou `'non renseigné'` active `niveau hors grille` et donne un minimum nul.

## Prime d'ancienneté (article 36)

Majoration de 32 € par mois pour chaque période de **3 ans révolue** (4 ans : 32 € ; 6 ans : 64 €),
due à partir du 1er janvier suivant la date d'anniversaire. Le modèle compte les périodes entières à
partir de `années complètes d'ancienneté` ; l'application doit fournir une ancienneté arrêtée en tenant
compte du décalage au 1er janvier. Le texte ne prévoit pas de proratisation pour le temps partiel :
elle n'est pas appliquée. Le statut de négociateur (annexe IV) a sa propre prime et n'est pas modélisé.

## Sources officielles

- [Avenant n° 111 du 24 juin 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054951900)
- [Arrêté d'extension](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054860891)
- [Article 36 — ancienneté](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000049954870)

## Maintien de salaire

La révision 2026.3 ajoute le maintien de salaire conventionnel (article 24.2) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package.

La révision 2026.4 ajoute l'indemnité de départ en retraite (article 34), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. Les indemnités de licenciement et de mise à la retraite reprennent le barème légal.

## Financement du paritarisme

La révision 2026.5, à la date d'effet de la version 2026.4, ajoute `financement du paritarisme` : contribution conventionnelle des entreprises au dialogue social, en pourcentage de la masse salariale brute selon l'effectif : 0,0125 % jusqu'à 10 salariés, 0,0075 % de 11 à 49, 0,005 % de 50 à 299, 0,0015 % à partir de 300 (article 3 de l'avenant n° 106 du 28 mai 2025). Le minimum annuel par entreprise n'est pas calculé (KALITEXT000052018210). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
