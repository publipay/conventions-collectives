import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Amounts read in the legal texts on Légifrance (November 2026), independently of the rules.
async function engineOf(agreement: string, versionName: string, value: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionName);
  assert.ok(version, `${agreement} ${versionName}`);
  const ns = `salarié . convention collective . ${value}`;
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  const extension = await version.loadRules();
  for (const name of Object.keys(extension)) {
    assert.ok(name === ns || name.startsWith(`${ns} . `), name);
    assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
  }
  Object.assign(rules, extension);
  return { engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }), ns, version };
}

const cents = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("confiserie, chocolaterie, biscuiterie, détaillants (IDCC 1286)", () => {
  const agreement = "1286-confiserie-chocolaterie-biscuiterie-detaillants";
  const value = "confiserie chocolaterie détaillants";
  const grids: [string, string, [number, number][], [number, number][]][] = [
    ["2025.1", "2025-03-01",
      [[120, 1820.04], [130, 1833.69], [140, 1886.77], [150, 1945.93], [160, 2015.69], [170, 2046.03]],
      [[190, 2135.51], [210, 2335.72], [250, 2554.12], [350, 3811.47], [400, 4170.93], [500, 4735.14]]],
    ["2026.1", "2026-04-01",
      [[120, 1842.79], [130, 1856.44], [140, 1909.53], [150, 1970.19], [160, 2039.96], [170, 2071.81]],
      [[190, 2161.3], [210, 2364.54], [250, 2585.97], [350, 3858.48], [400, 4220.98], [500, 4792.77]]],
  ];
  for (const [versionName, validFrom, binding, indicative] of grids) {
    it(`${versionName}: gives the binding grid, and the indicative amounts apart`, async () => {
      const { engine, ns, version } = await engineOf(agreement, versionName, value);
      assert.equal(version.validFrom, validFrom);
      assert.equal(version.extension, undefined);
      const evaluate = (coefficient: number, quota = "100%") => {
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${ns} . coefficient`]: coefficient,
          "salarié . contrat . temps de travail . quotité": quota,
        });
        return {
          minimum: cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue),
          indicative: cents(engine.evaluate(`${ns} . montant indicatif`).nodeValue),
          outOfGrid: engine.evaluate(`${ns} . coefficient hors grille`).nodeValue,
        };
      };
      for (const [coefficient, amount] of binding) {
        assert.deepEqual(evaluate(coefficient), { minimum: amount, indicative: 0, outOfGrid: false });
      }
      for (const [coefficient, amount] of indicative) {
        assert.deepEqual(evaluate(coefficient), { minimum: 0, indicative: amount, outOfGrid: false });
      }
      assert.equal(evaluate(binding[0]![0], "50%").minimum, Math.round(binding[0]![1] * 50) / 100);
      assert.equal(evaluate(180).outOfGrid, true);
    });
  }
});

describe("réseaux de transports publics urbains (IDCC 1424)", () => {
  const agreement = "1424-reseaux-transports-publics-urbains";
  const value = "réseaux de transports urbains";
  // Months of seniority of each column of the annex.
  const steps = [0, 6, 12, 36, 60, 120, 180, 240, 300, 360];
  type Row = [number, ...number[]];
  const grids: { version: string; validFrom: string; extension: string; workers: Row[]; supervisors: Row[]; executives: [number, number][] }[] = [
    {
      version: "2025.1", validFrom: "2025-01-01", extension: "2025-07-05",
      workers: [
        [145, 1846.68, 1902.08, 1975.95, 2031.35, 2068.28, 2105.22, 2160.62, 2216.02, 2271.42],
        [155, 1857.8, 1913.53, 1987.85, 2043.58, 2080.74, 2117.89, 2173.63, 2229.36, 2285.09],
        [170, 1864.53, 1920.47, 1995.05, 2050.98, 2088.27, 2125.56, 2181.5, 2237.44, 2293.37],
        [175, 1871.27, 1927.41, 2002.26, 2058.4, 2095.82, 2133.25, 2189.39, 2245.52, 2301.66],
        [185, 1874.64, 1930.88, 2005.86, 2062.1, 2099.6, 2137.09, 2193.33, 2249.57, 2305.81],
        [190, 1880.02, 1936.42, 2011.62, 2068.02, 2105.62, 2143.22, 2199.62, 2256.02, 2312.42],
        [200, 1970, 2029.1, 2107.9, 2167, 2206.4, 2245.8, 2304.9, 2364, 2423.1],
        [205, 2019.25, 2079.83, 2160.6, 2221.18, 2261.56, 2301.95, 2362.52, 2423.1, 2483.68],
        [210, 2068.5, 2130.56, 2213.3, 2275.35, 2316.72, 2358.09, 2420.15, 2482.2, 2544.26],
        [220, 2167, 2232.01, 2318.69, 2383.7, 2427.04, 2470.38, 2535.39, 2600.4, 2665.41],
      ],
      supervisors: [
        [205, 2019.25, 2079.83, 2160.6, 2221.18, 2261.56, 2301.95, 2362.52, 2423.1, 2524.06, 2625.03],
        [210, 2068.5, 2130.56, 2213.3, 2275.35, 2316.72, 2358.09, 2420.15, 2482.2, 2585.63, 2689.05],
        [220, 2167, 2232.01, 2318.69, 2383.7, 2427.04, 2470.38, 2535.39, 2600.4, 2708.75, 2817.1],
        [230, 2265.5, 2333.47, 2424.09, 2492.05, 2537.36, 2582.67, 2650.64, 2718.6, 2831.88, 2945.15],
        [240, 2364, 2434.92, 2529.48, 2600.4, 2647.68, 2694.96, 2765.88, 2836.8, 2955, 3073.2],
        [250, 2462.5, 2536.38, 2634.88, 2708.75, 2758, 2807.25, 2881.13, 2955, 3078.13, 3201.25],
        [270, 2659.5, 2739.29, 2845.67, 2925.45, 2978.64, 3031.83, 3111.62, 3191.4, 3324.38, 3457.35],
        [280, 2758, 2840.74, 2951.06, 3033.8, 3088.96, 3144.12, 3226.86, 3309.6, 3447.5, 3585.4],
        [300, 2955, 3043.65, 3161.85, 3250.5, 3309.6, 3368.7, 3457.35, 3546, 3693.75, 3841.5],
        [310, 3053.5, 3145.11, 3267.25, 3358.85, 3419.92, 3480.99, 3572.6, 3664.2, 3816.88, 3969.55],
        [320, 3152, 3246.56, 3372.64, 3467.2, 3530.24, 3593.28, 3687.84, 3782.4, 3940, 4097.6],
        [340, 3349, 3449.47, 3583.43, 3683.9, 3750.88, 3817.86, 3918.33, 4018.8, 4186.25, 4353.7],
        [360, 3546, 3652.38, 3794.22, 3900.6, 3971.52, 4042.44, 4148.82, 4255.2, 4432.5, 4609.8],
      ],
      executives: [[300, 2955], [390, 3841.5], [430, 4235.5], [530, 5220.5], [630, 6205.5], [690, 6796.5]],
    },
    {
      version: "2026.1", validFrom: "2026-01-01", extension: "2026-05-31",
      workers: [
        [145, 1868.84, 1924.91, 1999.66, 2055.72, 2093.1, 2130.48, 2186.54, 2242.61, 2298.67],
        [155, 1880.09, 1936.49, 2011.7, 2068.1, 2105.7, 2143.3, 2199.71, 2256.11, 2312.51],
        [170, 1886.9, 1943.51, 2018.98, 2075.59, 2113.33, 2151.07, 2207.67, 2264.28, 2320.89],
        [175, 1893.73, 1950.54, 2026.29, 2083.1, 2120.98, 2158.85, 2215.66, 2272.48, 2329.29],
        [185, 1897.14, 1954.05, 2029.94, 2086.85, 2124.8, 2162.74, 2219.65, 2276.57, 2333.48],
        [190, 1902.58, 1959.66, 2035.76, 2092.84, 2130.89, 2168.94, 2226.02, 2283.1, 2340.17],
        [200, 1994, 2053.82, 2133.58, 2193.4, 2233.28, 2273.16, 2332.98, 2392.8, 2452.62],
        [205, 2043.85, 2105.17, 2186.92, 2248.24, 2289.11, 2329.99, 2391.3, 2452.62, 2513.94],
        [210, 2093.7, 2156.51, 2240.26, 2303.07, 2344.94, 2386.82, 2449.63, 2512.44, 2575.25],
        [220, 2193.4, 2259.2, 2346.94, 2412.74, 2456.61, 2500.48, 2566.28, 2632.08, 2697.88],
      ],
      supervisors: [
        [205, 2043.85, 2105.17, 2186.92, 2248.24, 2289.11, 2329.99, 2391.3, 2452.62, 2554.81, 2657.01],
        [210, 2093.7, 2156.51, 2240.26, 2303.07, 2344.94, 2386.82, 2449.63, 2512.44, 2617.13, 2721.81],
        [220, 2193.4, 2259.2, 2346.94, 2412.74, 2456.61, 2500.48, 2566.28, 2632.08, 2741.75, 2851.42],
        [230, 2293.1, 2361.89, 2453.62, 2522.41, 2568.27, 2614.13, 2682.93, 2751.72, 2866.38, 2981.03],
        [240, 2392.8, 2464.58, 2560.3, 2632.08, 2679.94, 2727.79, 2799.58, 2871.36, 2991, 3110.64],
        [250, 2492.5, 2567.28, 2666.98, 2741.75, 2791.6, 2841.45, 2916.23, 2991, 3115.63, 3240.25],
        [270, 2691.9, 2772.66, 2880.33, 2961.09, 3014.93, 3068.77, 3149.52, 3230.28, 3364.88, 3499.47],
        [280, 2791.6, 2875.35, 2987.01, 3070.76, 3126.59, 3182.42, 3266.17, 3349.92, 3489.5, 3629.08],
        [300, 2991, 3080.73, 3200.37, 3290.1, 3349.92, 3409.74, 3499.47, 3589.2, 3738.75, 3888.3],
        [310, 3090.7, 3183.42, 3307.05, 3399.77, 3461.58, 3523.4, 3616.12, 3708.84, 3863.38, 4017.91],
        [320, 3190.4, 3286.11, 3413.73, 3509.44, 3573.25, 3637.06, 3732.77, 3828.48, 3988, 4147.52],
        [340, 3389.8, 3491.49, 3627.09, 3728.78, 3796.58, 3864.37, 3966.07, 4067.76, 4237.25, 4406.74],
        [360, 3589.2, 3696.88, 3840.44, 3948.12, 4019.9, 4091.69, 4199.36, 4307.04, 4486.5, 4665.96],
      ],
      executives: [[300, 2991], [390, 3888.3], [430, 4287.1], [530, 5284.1], [630, 6281.1], [690, 6879.3]],
    },
  ];

  for (const grid of grids) {
    it(`${grid.version}: gives every amount of the annex`, async () => {
      const { engine, ns, version } = await engineOf(agreement, grid.version, value);
      assert.equal(version.validFrom, grid.validFrom);
      assert.equal(version.extension, grid.extension);
      const evaluate = (category: string, coefficient: number, months: number, quota = "100%") => {
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${ns} . catégorie`]: `'${category}'`,
          [`${ns} . coefficient`]: coefficient,
          [`${ns} . ancienneté dans l'entreprise`]: months,
          "salarié . contrat . temps de travail . quotité": quota,
        });
        return cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue);
      };
      const check = (category: string, rows: Row[]) => {
        for (const [coefficient, ...amounts] of rows) {
          amounts.forEach((amount, step) => {
            assert.equal(evaluate(category, coefficient, steps[step]!), amount, `${category} ${coefficient} ${steps[step]} months`);
          });
        }
      };
      check("ouvriers et employés", grid.workers);
      check("maîtrise", grid.supervisors);
      for (const [coefficient, amount] of grid.executives) {
        assert.equal(evaluate("ingénieurs et cadres", coefficient, 0), amount);
        assert.equal(evaluate("ingénieurs et cadres", coefficient, 240), amount, "only the amount at hiring");
      }
      // Each step is reached at its threshold, not one month earlier; the last workers' step stays after 30 years.
      assert.equal(evaluate("ouvriers et employés", 145, 5), grid.workers[0]![1]);
      assert.equal(evaluate("ouvriers et employés", 145, 11), grid.workers[0]![2]);
      assert.equal(evaluate("ouvriers et employés", 145, 400), grid.workers[0]![9]);
      assert.equal(evaluate("ouvriers et employés", 145, 0, "50%"), Math.round(grid.workers[0]![1]! * 50) / 100);
    });

    it(`${grid.version}: flags a coefficient absent from the category's grid`, async () => {
      const { engine, ns } = await engineOf(agreement, grid.version, value);
      const outOfGrid = (category: string, coefficient: number) => {
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${ns} . catégorie`]: `'${category}'`,
          [`${ns} . coefficient`]: coefficient,
        });
        return engine.evaluate(`${ns} . coefficient hors grille`).nodeValue;
      };
      assert.equal(outOfGrid("ouvriers et employés", 145), false);
      assert.equal(outOfGrid("ouvriers et employés", 230), true);
      assert.equal(outOfGrid("maîtrise", 200), true);
      assert.equal(outOfGrid("maîtrise", 300), false);
      assert.equal(outOfGrid("ingénieurs et cadres", 300), false);
      assert.equal(outOfGrid("ingénieurs et cadres", 310), true);
      assert.equal(outOfGrid("non renseigné", 300), true);
    });
  }
});

describe("mareyeurs-expéditeurs (IDCC 1589)", () => {
  const agreement = "1589-mareyeurs-expediteurs";
  const value = "mareyeurs expéditeurs";
  const grids: [string, string, string, number[]][] = [
    ["2024.1", "2024-12-01", "2025-03-18", [1806.39, 1821.56, 1848.86, 1860.99, 1906.49, 2059.68, 2592.04, 3392.86]],
    ["2026.1", "2026-01-01", "2026-04-17", [1830.66, 1842.79, 1871.61, 1883.74, 1929.24, 2083.95, 2623.89, 3433.81]],
  ];
  const levels = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  for (const [versionName, validFrom, extension, amounts] of grids) {
    it(`${versionName}: gives the eight levels`, async () => {
      const { engine, ns, version } = await engineOf(agreement, versionName, value);
      assert.equal(version.validFrom, validFrom);
      assert.equal(version.extension, extension);
      const evaluate = (level: string, quota = "100%") => {
        engine.setSituation({
          "salarié . convention collective": `'${value}'`,
          [`${ns} . niveau`]: `'${level}'`,
          "salarié . contrat . temps de travail . quotité": quota,
        });
        return cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue);
      };
      levels.forEach((level, index) => assert.equal(evaluate(level), amounts[index], level));
      assert.equal(evaluate("I", "50%"), Math.round(amounts[0]! * 50) / 100);
      evaluate("IX");
      assert.equal(engine.evaluate(`${ns} . niveau hors grille`).nodeValue, true);
    });
  }
});

describe("éditeurs de la presse magazine (IDCC 3225)", () => {
  const value = "presse magazine";
  const grid: [number, number, number, number, number][] = [
    [1, 1809.92, 1864.21, 1918.51, 1990.91],
    [2, 1809.92, 1864.21, 1918.51, 1990.91],
    [3, 1921.41, 1979.06, 2036.7, 2113.56],
    [4, 2053.93, 2115.55, 2177.17, 2259.33],
    [5, 2236.13, 2303.22, 2370.3, 2459.75],
    [6, 2403.84, 2475.96, 2548.07, 2644.22],
    [7, 2716.34, 2797.83, 2879.32, 2987.97],
    [8, 3167.07, 3262.08, 3357.09, 3483.77],
    [9, 3490.51, 3595.22, 3699.94, 3839.56],
  ];
  it("2024.1: gives every amount of the annex", async () => {
    const { engine, ns, version } = await engineOf("3225-editeurs-presse-magazine", "2024.1", value);
    assert.equal(version.validFrom, "2024-07-01");
    assert.equal(version.extension, "2024-09-12");
    const evaluate = (group: number, years: number, quota = "100%") => {
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${ns} . groupe`]: group,
        [`${ns} . ancienneté dans l'entreprise`]: years,
        "salarié . contrat . temps de travail . quotité": quota,
      });
      return cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue);
    };
    for (const [group, ...amounts] of grid) {
      [0, 3, 6, 10].forEach((years, step) => assert.equal(evaluate(group, years), amounts[step], `${group} ${years}`));
      assert.equal(evaluate(group, 2), amounts[0]);
      assert.equal(evaluate(group, 9), amounts[2]);
    }
    assert.equal(evaluate(1, 0, "50%"), 904.96);
    evaluate(10, 0);
    assert.equal(engine.evaluate(`${ns} . groupe hors grille`).nodeValue, true);
  });
});

describe("industrie des tuiles et briques (IDCC 1170)", () => {
  const value = "tuiles et briques";
  const annual: Record<string, number> = {
    "1.A": 23018, "1.B": 23552, "1.C": 23646, "1.D": 24205,
    "2.A": 24224, "2.B": 24902, "2.C": 25830, "2.D": 27018,
    "3.A": 27070, "3.B": 27648, "3.C": 29017, "3.D": 30646,
    "4.A": 30700, "4.B": 31550, "4.C": 33295, "4.D": 35660,
    "5.A": 35709, "5.B": 37045, "5.C": 39854, "5.D": 43257,
  };
  const executives: [number, number][] = [
    [300, 1880.7], [322, 2018.62], [344, 2156.54], [366, 2294.45], [388, 2432.37], [410, 2570.29],
    [432, 2708.21], [454, 2846.13], [476, 2984.04], [498, 3121.96], [520, 3259.88], [542, 3397.8],
    [564, 3535.72], [586, 3673.63], [608, 3811.55], [630, 3949.47], [652, 4087.39],
  ];
  const bonuses: Record<string, number[]> = {
    "1": [23, 46, 69, 92, 115], "2": [27, 54, 81, 108, 135], "3": [30, 60, 90, 120, 150],
    "4": [40, 80, 120, 160, 200], "5": [50, 100, 150, 200, 250],
  };
  async function setup() {
    const { engine, ns, version } = await engineOf("1170-tuiles-briques", "2024.1", value);
    const set = (classification: string, years = 0, quota = "100%") =>
      engine.setSituation({
        "salarié . convention collective": `'${value}'`,
        [`${ns} . niveau`]: `'${classification}'`,
        [`${ns} . ancienneté dans l'entreprise`]: years,
        "salarié . contrat . temps de travail . quotité": quota,
      });
    return { engine, ns, version, set };
  }

  it("2024.1: gives the annual guarantee and its twelfth, and the executives' monthly minimum", async () => {
    const { engine, ns, version, set } = await setup();
    assert.equal(version.validFrom, "2024-01-01");
    assert.equal(version.extension, "2024-11-07");
    for (const [classification, amount] of Object.entries(annual)) {
      set(classification);
      assert.equal(engine.evaluate(`${ns} . rémunération minimale annuelle garantie`).nodeValue, amount, classification);
      assert.equal(cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue), Math.round((amount / 12) * 100) / 100, classification);
    }
    for (const [coefficient, amount] of executives) {
      set(`cadre ${coefficient}`);
      assert.equal(cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue), amount);
    }
    set("cadre 300", 0, "50%");
    assert.equal(cents(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue), 940.35);
    for (const invalid of ["6.A", "1.E", "cadre 301"]) {
      set(invalid);
      assert.equal(engine.evaluate(`${ns} . niveau hors grille`).nodeValue, true, invalid);
    }
    set("1.A");
    assert.equal(engine.evaluate(`${ns} . niveau hors grille`).nodeValue, false);
  });

  it("2024.1: gives the seniority bonus of the group, none for an executive", async () => {
    const { engine, ns, set } = await setup();
    const bonus = (classification: string, years: number, quota = "100%") => {
      set(classification, years, quota);
      return engine.evaluate(`${ns} . prime d'ancienneté`).nodeValue;
    };
    for (const [group, amounts] of Object.entries(bonuses)) {
      for (const letter of ["A", "D"]) {
        assert.equal(bonus(`${group}.${letter}`, 2), 0);
        [3, 6, 9, 12, 15].forEach((years, step) => assert.equal(bonus(`${group}.${letter}`, years), amounts[step], `${group} ${years}`));
        assert.equal(bonus(`${group}.${letter}`, 40), amounts[4]);
      }
    }
    assert.equal(bonus("3.B", 6, "50%"), 30);
    assert.equal(bonus("cadre 652", 20), 0);
  });
});
