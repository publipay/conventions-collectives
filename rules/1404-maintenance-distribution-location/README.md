# Maintenance, distribution et location de matériels — IDCC 1404

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er mars 2026** pour 151,67 heures mensuelles. Elle reprend l’avenant n° 16 du 18 février 2026 et son champ étendu par l’arrêté publié au Journal officiel le 29 mai 2026.

La valeur Publicodes est `maintenance distribution location` et les règles sont sous `salarié . convention collective . maintenance distribution location`.

## Règles implémentées

- `niveau` reçoit l’un des 22 niveaux de la grille : `A10` à `A80`, `B10` à `B80` et `C10` à `C60`.
- `salaire minimum conventionnel` expose le minimum mensuel correspondant, pour 151,67 heures, proratisé selon `salarié . contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent le minimum nul et exposent `niveau hors grille` à `vrai`.

## Sources officielles

- Avenant n° 16 du 18 février 2026 relatif aux salaires minima conventionnels, texte KALI `KALITEXT000054177276`, article `KALIARTI000054177280`, BOCC 2026-14.
- Arrêté du 18 mai 2026 portant extension de l’avenant n° 16, publié au Journal officiel le 29 mai 2026, texte n° 46, NOR `TRST2612649A`, `JORFTEXT000054149369`.

## Limites

Le modèle ne déduit pas le niveau du poste et ne modélise pas les primes, majorations, ancienneté ou autres dispositions de la convention.

## Tests

`test/maintenance-distribution-location.test.ts` vérifie la date et les sources, les 22 niveaux de la grille, la proratisation à temps partiel, les niveaux hors grille et l’inapplicabilité pour une autre convention.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : contribution des entreprises au financement du dialogue social : 0,07 % de la masse salariale (article 4 de l'accord du 14 septembre 2011). Le minimum annuel de 100 € par entreprise n'est pas calculé ; le montant mensuel est une provision : 0,07 % du brut du mois (KALITEXT000025202009). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
