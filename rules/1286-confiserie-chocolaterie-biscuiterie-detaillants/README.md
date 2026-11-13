# Confiserie, chocolaterie, biscuiterie (détaillants) — IDCC 1286

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

- [2025.1](1286-confiserie-chocolaterie-biscuiterie-detaillants.2025.1.publicodes) : 1er mars 2025, avenant n° 42 du 20 novembre 2024.
- 2026.1 : 1er avril 2026, avenant n° 43 du 23 janvier 2026.

Chaque avenant fixe sa date d'effet au mois de publication de son arrêté d'extension. Il s'applique donc à tous les employeurs du champ à cette date, et les versions ne déclarent pas de champ `extension`.

La valeur Publicodes est `confiserie chocolaterie détaillants` ; les règles sont sous `salarié . convention collective . confiserie chocolaterie détaillants`.

## Règles implémentées

- `coefficient` : coefficient de 120 à 500 de la grille.
- `salaire minimum conventionnel` : minimum brut à temps plein des coefficients 120 à 170, multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois. Il vaut 0 pour les coefficients 190 à 500.
- `montant indicatif` : montant à temps plein des coefficients 190 à 500, que les avenants donnent « à titre indicatif » ; il n'est pas traité comme un minimum.
- `coefficient hors grille` signale un coefficient absent de la grille.

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le coefficient 120 concerne les débutants pendant 6 mois : le passage au coefficient suivant reste à saisir.
- Le salaire des apprentis en formation BTM (75 % puis 80 % du minimum, avenant n° 4 du 27 juin 2007) n'est pas modélisé.
- Le SMIC reste un plancher à appliquer par le moteur de paie.

## Sources

- Avenant n° 42 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051352420 (arrêté du 17 mars 2025, JORF du 29 mars 2025).
- Avenant n° 43 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054091922 (arrêté du 8 avril 2026, JORF du 17 avril 2026).
- Convention collective nationale du 1er janvier 1984, conteneur KALICONT000005635899.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : la contribution des entreprises au fonds d'aide au paritarisme, quel que soit leur effectif : 0,15 % des rémunérations comprises dans l'assiette des contributions de sécurité sociale (avenant n° 9 du 8 juin 2004, rédigé par l'avenant n° 1 du 10 avril 2025, KALITEXT000051947464, étendu par arrêté du 27 juin 2025). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`. Le montant mensuel est une provision sur le brut du mois ; la régularisation annuelle et les éventuels minimums par entreprise ne sont pas calculés.
