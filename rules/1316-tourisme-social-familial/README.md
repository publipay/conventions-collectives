# Tourisme social et familial — IDCC 1316

> Les versions 2026.1 et 2026.2 ont été supprimées pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 modélise les salaires minima mensuels des avenants n° 77 du 4 décembre 2025 et n° 78 du 15 janvier 2026, étendus par arrêtés publiés au Journal officiel en février et mai 2026. Il couvre les paliers d'entrée en vigueur du 1er janvier, du 1er février et du 1er mai 2026. Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `tourisme social et familial` ; les règles sont sous `salarié . convention collective . tourisme social et familial`.

## Règles implémentées

- `niveau` reçoit l'un des niveaux `A` à `G`.
- `date de calcul` sélectionne le palier légalement applicable en 2026.
- `grille mensuelle` donne le minimum brut pour 151,67 heures.
- `salaire minimum conventionnel` applique la quotité de travail de `modele-social`.
- `niveau hors grille` détecte les classifications absentes.

## Limites

- Les primes, le treizième mois, les avantages en nature et les autres éléments de rémunération ne sont pas modélisés.
- La version couvre les salaires minima 2026 à compter du 1er janvier 2026 ; les périodes antérieures sont signalées comme hors couverture.
- Le modèle ne déduit pas automatiquement les compléments individuels ou les dispositions plus favorables applicables au salarié.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : la contribution financière des entreprises de 0,05 % de la masse salariale brute, dont 0,02 % pour le fonctionnement du paritarisme et 0,03 % pour l'exercice du syndicalisme (article 3 de l'avenant n° 41 du 15 mai 2003, KALITEXT000005684557, étendu). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`. Le montant mensuel est une provision sur le brut du mois ; la régularisation annuelle et les éventuels minimums par entreprise ne sont pas calculés.

## Contribution conventionnelle de formation

La révision 2026.3, à la date d'effet de la version 2026.2, ajoute `formation professionnelle conventionnelle` : contribution supplémentaire conventionnelle de formation professionnelle : 0,40 % de la masse salariale brute sous 300 salariés, 0,20 % à partir de 300, sur les salaires de 2026 et 2027 (avenant n° 3 du 4 décembre 2025). Le minimum de 100 € par entreprise n'est pas calculé ; le montant mensuel est une provision sur le brut du mois (KALITEXT000053721440). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
