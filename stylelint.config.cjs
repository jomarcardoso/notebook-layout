/**
 * LAYER BOUNDARIES FOR THE CADERNINHO DESIGN SYSTEM
 * =================================================
 *
 * Copied from the generator and then pointed at this repository's real paths.
 *
 * The reason it is here rather than in `www`: the design system is THIS
 * package, and the boundary it enforces has to hold for every consumer. A rule
 * that only runs in one application is a rule the second application does not
 * have.
 *
 * -----------------------------------------------------------------------------
 * WHY THIS FILE EXISTS AT ALL
 * -----------------------------------------------------------------------------
 *
 * Every violation it catches was already in the codebase, and none of them were
 * found by reading. A nav component was painting its chosen state with
 * `--color-primary-main` and its label with `--color-white`, under a design
 * system whose whole point is that the chosen state is `--app-bg-selected` and
 * that a foreground is chosen to PAIR with its background and measured against
 * it. The rule below would have failed on that line the first time it ran.
 *
 * It never ran. That is the entire story, and it is why wiring the lint matters
 * more than fixing the file it catches.
 */
module.exports = {
  plugins: ['../tools/stylelint/no-nested-bem-element.mjs'],

  rules: {
    /* BEM has two levels. See the plugin for why nesting an element inside an
     * element produces a class name nobody can find by searching. */
    'recepta/no-nested-bem-element': true,
    /* No literal colours. Layer 1 is the only exception, below. */
    'color-no-hex': true,

    /* And no NAMED colours. `color-no-hex` only catches `#fff`, so
     * `color: white` in the footer sailed through every guard here — it was
     * found by reading, not by any check. A keyword is a literal like any
     * other. */
    'color-named': 'never',
    'declaration-property-value-disallowed-list': {
      '/^(color|background|background-color|border-color|fill|stroke)$/': [
        /* `#` starts a hex colour AND a Sass interpolation; `(?!\{)` keeps this
         * pointed at `#fff` and off `#{core.ref('bg-page')}`. */
        /^#(?!\{)/,
        /^rgb/,
        /^hsl/,
        /^oklch/
      ]
    }
  },

  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    },
    {
      /* Layer 1 — the only place literals are legal. A brand hands over hex. */
      files: ['styles/_base.scss', 'styles/_srgb.scss'],
      rules: {
        'color-no-hex': null,
        'declaration-property-value-disallowed-list': null
      }
    },
    {
      /* Layer 2 assigns meaning by reading layer 1 at build time, so it carries
       * interpolations everywhere and no literals of its own. */
      files: ['styles/_semantic.scss'],
      rules: {
        'color-no-hex': null,

        /* `pal(red, 500)` names a palette FAMILY. Unquoted `red` in Sass is a
         * colour value, not a string, so the comparison in `pal()` cannot be
         * written with quotes — and the lint reads the identifier as a named
         * colour. Layer 2 is the one file allowed to speak in family names. */
        'color-named': null
      }
    },
    {
      /* THE IMPORTANT ONE.
       *
       * Component and application code reaches only as far as layer 2. Blocked:
       *
       *   var(--color-*)   this package's OLD palette vocabulary, including
       *                    `--color-primary-main` and `--color-white`
       *   var(--cui-*)     CoreUI's namespace — the adapter's job, never a
       *                    component's
       *   var(--bs-*)      Bootstrap's, for the same reason
       *   var(--app-base-*) layer 1, if runtime emission is ever turned on
       *
       * There is NO adapter for this package, and that is the point. An adapter
       * translates a third-party library that does not know the foundation
       * exists. This package IS the design system, built on the foundation, so
       * its components read layer 2 directly. For a while there was one, and it
       * did real harm: it kept `--color-primary-main` resolving, which made the
       * old vocabulary look healthy and hid how much of the library had never
       * been migrated.
       *
       * So every name on that list is now a hard error rather than a shim with
       * a retirement plan. The count this reports is the true remaining work.
       */
      files: [
        'components/**/*.{css,scss}',
        'styles/**/*.{css,scss}'
      ],
      excludedFiles: [
        'styles/_*.scss',
        'styles/foundation.scss',
        'styles/coreui-entry.scss'
      ],
      rules: {
        'declaration-property-value-disallowed-list': [
          {
            '/.*/': [
              /var\(\s*--app-base-/,
              /var\(\s*--color-/,
              /var\(\s*--bs-/,
              /var\(\s*--cui-/
            ]
          },
          {
            message:
              'Reach only as far as layer 2. Use var(--app-<semantic-token>); ' +
              'if the token does not exist, add it to styles/_semantic.scss. ' +
              'Never read a library variable (--cui-*, --bs-*) from a component.'
          }
        ]
      }
    },
    {
      /* Adapters are the one place a third-party namespace is legal — that is
       * their entire job. They may never read layer 1. */
      files: ['styles/_coreui.scss'],
      rules: {
        'color-no-hex': null,
        'declaration-property-value-disallowed-list': [
          { '/.*/': [/var\(\s*--app-base-/] },
          { message: 'Adapters read layer 2 only, never layer 1 primitives.' }
        ]
      }
    }
  ]
};
