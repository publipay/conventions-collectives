# Commerce de détail de l'horlogerie-bijouterie — IDCC 1487

La version `2026.1` modélise la grille des salaires minima conventionnels mensuels applicable au **1er janvier 2026** pour 151,67 heures. Elle reprend l'avenant n° 33 du 21 novembre 2025, étendu par arrêté du 17 février 2026 publié au Journal officiel le 24 février 2026.

La valeur Publicodes est `commerce de détail horlogerie bijouterie` et les règles sont sous `salarié . convention collective . commerce de détail horlogerie bijouterie`.

## Règles implémentées

- `niveau` reçoit l'un des dix niveaux de la grille : `A` à `J`.
- `salaire minimum conventionnel` expose le minimum mensuel correspondant pour 151,67 heures, proratisé selon `salarié . contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent le minimum nul et exposent `niveau hors grille` à `vrai`.

## Sources officielles

- Avenant n° 33 du 21 novembre 2025 relatif aux salaires minima conventionnels, texte KALI `KALITEXT000054033785`, article `KALIARTI000054033788`.
- Arrêté du 17 février 2026 portant extension de l'avenant n° 33, publié au Journal officiel le 24 février 2026, JORF du 24 février 2026.

## Limites

Le modèle ne déduit pas le niveau du poste et ne modélise pas les primes, majorations, ancienneté ou autres dispositions de la convention.

## Tests

`test/commerce-detail-horlogerie-bijouterie.test.ts` vérifie la date et les sources, les dix niveaux de la grille, la proratisation à temps partiel, les niveaux hors grille et l'inapplicabilité pour une autre convention.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : contribution des entreprises au financement du paritarisme : 0,08 % de la masse salariale brute (article 1er de l'accord du 10 octobre 2018). Le plancher de 60 € et les plafonds par entreprise au-delà de 200 salariés ne sont pas calculés (KALITEXT000038616327). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
