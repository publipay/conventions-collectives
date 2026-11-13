# Salariés des cabinets d'avocats — IDCC 3253

> Les versions 2025.1 et 2026.1 ont été supprimées pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.

Le modèle `2025.1` entre en vigueur le **1er octobre 2025**, premier jour du mois suivant la publication au Journal officiel de l'arrêté d'extension du 18 septembre 2025. Il couvre la convention collective nationale des salariés des cabinets d'avocats du 21 juin 2024, issue de la fusion des champs IDCC 1000 et IDCC 1850.

La version `2026.1` entre en vigueur le **1er mai 2026** avec l'accord de formation professionnelle du 2 juillet 2025 (voir l'audit ci-dessous).

## Règles calculées

- `coefficient` est la classification du personnel non-avocat fournie par l'application.
- `date de calcul` borne l'application à partir du 1er octobre 2025.
- `salaire minimum conventionnel` expose le minimum mensuel brut à temps plein puis applique une seule fois la quotité de travail.
- La grille reprend les 16 coefficients de l'avenant n° 136 du 24 janvier 2025 ; le `salaire minimum annuel conventionnel` expose les treize mensualités rappelées par cet avenant.
- `coefficient hors grille` signale les coefficients non présents sans inventer de montant.

## Audit explicite des rubriques de paie

L'audit a porté sur la convention de base, l'avenant salarial n° 136, l'arrêté d'extension, l'accord de formation professionnelle du 2 juillet 2025 et l'accord de financement du paritarisme du 12 décembre 2025, ainsi que sur les textes dédiés publiés pour la santé et la prévoyance.

- **Salaires, bases et avantages** : la grille mensuelle et la règle des treize mensualités sont calculées ; aucune prime, indemnité, avantage en nature, forfait ou assiette conventionnelle additionnelle n'est calculé sans entrée fiable et disposition directement applicable au salarié.
- **Cotisations salariales et patronales** : à partir de la révision 2025.2, `financement du paritarisme` calcule la cotisation obligatoire des employeurs de l'accord du 14 avril 2023 (étendu le 30 novembre 2023, maintenu dans la convention du 21 juin 2024 par l'accord du 12 décembre 2025) : 0,06 % de la masse salariale brute plafonnée au plafond de la sécurité sociale, pour le personnel non-avocat comme pour les avocats salariés, quel que soit l'effectif, appelée par l'OPCO EP à terme échu. Elle est provisionnée chaque mois sur l'assiette du salarié plafonnée au plafond du mois et ajoutée à `salarié . cotisations . employeur`. La version 2025.1 ne la calculait pas, bien que l'accord ait été lu lors de l'audit. Aucun autre taux conventionnel salarié ou employeur n'est ajouté ; les cotisations légales et de droit commun restent celles de `modele-social`.
- **Santé et prévoyance** : l'audit n'a pas retenu de taux ou répartition calculable dans la version publiée ; les garanties, l'organisme assureur, les catégories et les appels éventuels dépendent de paramètres de régime absents. Aucune règle santé/prévoyance n'est donc inventée.
- **Formation professionnelle** : à partir de la version 2026.1 (1er mai 2026), `cotisations . formation professionnelle` ajoute à la contribution légale de `modele-social` la contribution conventionnelle supplémentaire de l'article 20 de l'accord du 2 juillet 2025 (KALITEXT000052344249, étendu par arrêté du 26 mars 2026 publié le 4 avril 2026, en vigueur le 1er jour du mois suivant) : 0,35 % de la masse salariale brute pour les entités de 1 à 299 salariés, collectée par l'OPCO EP, provisionnée chaque mois sur l'assiette du salarié. Aucune contribution conventionnelle n'est due à partir de 300 salariés. Avant le 1er mai 2026, l'avenant n° 126 du 15 mars 2019 relatif à la contribution conventionnelle de l'ancienne branche IDCC 1000, que l'accord remplace, n'a pas été trouvé dans KALI : les versions 2025.1 et 2025.2 n'ajoutent aucune contribution conventionnelle de formation.
- **AT/MP** : aucun taux de branche calculable n'est créé ; le taux AT/MP reste celui de l'établissement et de sa tarification.
- **Primes et indemnités** : aucun montant exploitable et conditionné par des variables absentes n'est inclus. Le salaire annuel ne doit pas être interprété comme un treizième mois versé à une date particulière.

Ces omissions sont intentionnelles et testées par l'isolation du namespace : le modèle n'écrase aucune règle de `modele-social` et ne prétend pas calculer une obligation dont la base, le plafond, la catégorie ou le régime ne sont pas fournis.

## Limites

- Le modèle concerne les salariés non-avocats et ne modélise pas une rémunération propre aux avocats salariés.
- Une nouvelle version devra être ajoutée pour tout avenant salarial postérieur.
- Les éléments variables, primes, garanties de protection sociale et contributions nécessitant des paramètres d'entreprise restent à renseigner par l'application.

## Contribution conventionnelle de formation

La révision 2026.2, à la date d'effet de la version 2026.1, sort la part conventionnelle de la contribution de formation professionnelle (0,35 % de l'assiette des cotisations de 1 à 299 salariés) de la contribution légale : `formation professionnelle conventionnelle` s'ajoute à `salarié . cotisations . employeur`, et `salarié . cotisations . formation professionnelle` redevient la seule contribution légale. Le montant total est inchangé.
