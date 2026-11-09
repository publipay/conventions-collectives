# Cabinets et cliniques vétérinaires — IDCC 1875

Le fichier [2026.1](1875-cabinets-cliniques-veterinaires.2026.1.publicodes) est applicable au 1er janvier 2026. Il reprend l'avenant n° 91 du 6 janvier 2026, qui fixe la valeur du point à 17,96 € sur la base de 151,67 heures, ainsi que la classification salariale issue de l'avenant n° 82 du 9 juin 2022. L'avenant n° 91 a été étendu par arrêté du 2 avril 2026 publié au Journal officiel du 17 avril 2026.

La valeur Publicodes est `cabinets et cliniques vétérinaires` ; les règles sont sous `salarié . convention collective . cabinets et cliniques vétérinaires`.

## Règles implémentées

- `coefficient` accepte les cinq coefficients salariés modélisés : 105, 108, 110, 113 et 120.
- `valeur du point` expose 17,96 €.
- `salaire minimum conventionnel` calcule le minimum mensuel brut à temps plein sur 151,67 heures, puis le prorata de la quotité de travail.
- `coefficient hors grille` signale une classification absente et retourne 0 pour le minimum.

## Audit paie et limites

Le modèle couvre la grille de salaires minima des salariés non vétérinaires. Les primes, majorations de dimanche et jours fériés, astreintes, frais, congés supplémentaires, santé, prévoyance, formation professionnelle et les dispositions propres aux vétérinaires cadres ne sont pas calculés automatiquement. Ils doivent être traités par l'application avec les données de paie et les conditions d'éligibilité correspondantes ; leur absence du minimum ne vaut pas renonciation à la règle conventionnelle.

Les coefficients non listés ne sont pas extrapolés. Cette version n'essaie pas de reconstituer les classifications historiques ou les emplois vétérinaires.

## Sources officielles

- Avenant n° 91 du 6 janvier 2026 relatif à la valeur du point — Légifrance, texte KALITEXT000054066637.
- Avenant n° 82 du 9 juin 2022 relatif aux salaires minima et aux classifications — Légifrance.
- Arrêté du 2 avril 2026 portant extension de l'avenant n° 91 — Journal officiel du 17 avril 2026.

## Contribution conventionnelle de formation

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `formation professionnelle conventionnelle` : contribution conventionnelle de formation professionnelle : 0,45 % de la masse salariale brute sous 11 salariés, 0,60 % à partir de 11 (avenant n° 77 du 5 juin 2019). Le montant mensuel est une provision sur le brut du mois (KALITEXT000039479873). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
