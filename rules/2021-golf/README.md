# Golf — IDCC 2021

> La version 2026.1 a été supprimée pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.
>
> Les versions 2026.2 et 2026.3 ont été supprimées pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.

## Version et périmètre

`2026.1` est applicable au **1er avril 2026** et `2026.2` corrige les sources et le minimum annuel du groupe 6 à la suite de l'avenant n° 96 du 21 janvier 2026, étendu le 17 avril 2026. L'audit s'appuie exclusivement sur les références officielles Légifrance/JORF indiquées dans les règles.

| Groupe | Minimum mensuel brut à temps plein |
|---|---:|
| 1 | 1 882,56 € |
| 2 | 1 899,84 € |
| 3 | 1 975,06 € |
| 4 | 2 136,68 € |
| 5 | 2 379,63 € |
| 6 | 3 032,22 € |
| 7 | 3 586,21 € |

Le minimum mensuel est proratisé par la quotité de travail. Une classification absente ou différente de 1 à 7 rend le minimum mensuel non applicable ; le résultat ne doit pas être interprété comme une valeur zéro.

Après **deux ans d'ancienneté non interrompue dans le groupe de classification et dans l'entreprise ou la ou les chaîne(s) de golf regroupant différentes structures**, l'accord prévoit en complément un minimum annuel pour les groupes 6 et 7 : **37 899 €/an** dans `2026.1`, puis **38 524 €/an** dans `2026.2` pour le groupe 6, et **48 060 €/an** pour le groupe 7 (plafond annuel de la sécurité sociale 2026). La sortie `salaire minimum annuel conventionnel` conserve l'unité annuelle et est proratisée par la quotité. Le modèle ne convertit pas ce minimum annuel en douzième mensuel et ne calcule pas les régularisations ou comparaisons de rémunération.

## Entrées et limites

Préfixe : `salarié . convention collective . golf` ; choix de convention : `'golf'`.

- `groupe` : chaîne `'1'` à `'7'`.
- `deux ans d'ancienneté` : booléen, par défaut `non`. Il doit être fourni par le consommateur à partir des dates et règles d'ancienneté applicables.
- `contrat . temps de travail . quotité` : entrée standard de `modele-social` utilisée pour la proratisation.

Ne sont pas modélisés : classifications détaillées au sein des groupes, primes, majorations, congés, maintien de salaire, indemnités, temps de travail, régularisations annuelles et autres dispositions de la convention. Le minimum légal ou contractuel plus favorable reste à comparer par l'application consommatrice.

## Sources officielles

- [Arrêté du 8 avril 2026 portant extension de l'avenant n° 96, JORF du 17 avril 2026](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000053907829).
- [Avenant n° 96 du 21 janvier 2026 relatif aux salaires minima conventionnels, texte convention collective Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092229).
- [Article 1er de l'avenant n° 96, Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054092233).

## Validation

`test/golf.test.ts` vérifie les sept montants mensuels, la proratisation, les deux minima annuels conditionnés par l'ancienneté, l'inapplicabilité d'une classification hors grille et l'isolation hors convention.

## Financement du paritarisme

La révision 2026.3, à la date d'effet de la version 2026.2, ajoute `financement du paritarisme` : la cotisation annuelle des entreprises au fonds d'aide au développement du paritarisme : 0,05 % de la masse salariale brute, dès le premier euro (article 2.3.3.1 de la convention, rédigé par l'avenant n° 47 du 16 septembre 2009, KALITEXT000021747679, étendu par arrêté du 23 juillet 2010). Le texte prévoit une renégociation annuelle du taux ; aucune n'est publiée dans KALI. Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`. Le montant mensuel est une provision sur le brut du mois ; la régularisation annuelle n'est pas calculée.

## Contribution conventionnelle de formation

La révision 2026.4, à la date d'effet de la version 2026.3, ajoute `formation professionnelle conventionnelle` : contribution conventionnelle de formation professionnelle : 0,25 % des rémunérations brutes, pour toutes les structures (article 9.2.4 de la convention, avenant n° 89 du 19 septembre 2023), versée à l'Afdas. Le montant mensuel est une provision : 0,25 % du brut du mois (KALITEXT000048638502). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
