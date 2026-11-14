# Industrie de la chaussure — IDCC 1580

> La version 2026.1 a été supprimée pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier [2026.2](1580-industrie-chaussure.2026.2.publicodes) entre en vigueur le 1er janvier 2026 et remplace la révision 2026.1 (même date d'effet), dont les clés mensuelles étaient décalées : un niveau 1.3 inexistant, 2.1 à 3.2 décalés d'un cran et 3.3 absent. La grille de l'accord compte 8 lignes mensuelles : niveau 1 (échelons 1 et 2), niveau 2 (échelons 1 à 3) et niveau 3 (échelons 1 à 3). Il modélise l'accord du 26 mars 2026 relatif aux salaires minima, étendu par arrêté du 11 juin 2026 publié au Journal officiel le 27 juin 2026. Les références officielles figurent dans les métadonnées du fichier source.

La valeur Publicodes est `industrie chaussure` ; les règles sont sous `salarié . convention collective . industrie chaussure`.

## Règles implémentées

- `classification` reçoit les classifications publiées : `1.1` et `1.2`, `2.1` à `2.3`, `3.1` à `3.3`, `4.1` à `6.2`, `P1.1`, `P1.2` et `P2` à `P4`.
- `grille mensuelle` donne les minima mensuels à temps complet des niveaux 1 à 3.
- `rémunération minimale annuelle` donne les minima annuels à temps complet des niveaux TAM 4 à 6 et des positions cadres P1 à P4 ; le minimum conventionnel en prend le douzième pour fournir une sortie mensuelle homogène.
- `salaire minimum conventionnel` applique la quotité de travail une seule fois.
- `classification hors grille` vaut vrai lorsqu'une classification n'est pas dans l'une des deux grilles.

## Limites

Le modèle couvre les minima de l'accord de salaires 2026. Les primes, accessoires, dispositions de durée du travail et autres garanties conventionnelles ne sont pas modélisés. Le modèle ne calcule pas le SMIC ; la règle légale correspondante reste à la charge du moteur consommateur.

## Version 2026.3

`2026.3`, applicable au **1er juin 2026**, reprend les minima de l'accord du 16 juillet 2026 relatif aux salaires minima conventionnels ([KALITEXT000055057353](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000055057353)), sur les mêmes classifications : minima mensuels des niveaux 1 à 3 (article 2), de 1 867,02 € (1.1) à 1 967 € (3.3), et minima annuels des niveaux 4 à 6 et des positions 1 à 4 (article 3), de 23 617 € (4.1) à 55 378 € (P4), toujours donnés par mois au douzième. Pour 2026, l'article 3 fait calculer le minimum annuel au prorata des mois de janvier à mai sur les minima de l'accord du 26 mars 2026 et des mois de juin à décembre sur ceux du nouvel accord : c'est ce que donnent, mois par mois, les douzièmes des versions 2026.2 et 2026.3. La condition d'un an de présence au 31 décembre et la vérification annuelle restent à la charge de l'utilisateur. L'accord est étendu par arrêté du 8 octobre 2026 (JORF du 13 octobre 2026, `extension: 2026-10-13`) : avant cette date, la version ne lie que les adhérents d'une organisation signataire. Texte lu par l'API Légifrance le 14 novembre 2026.

