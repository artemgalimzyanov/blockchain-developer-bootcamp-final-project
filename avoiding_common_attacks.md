# Contract Security Measures
This is a list of some security measurements used in this contract

## Floating Pragma (SWC-103)
Specific compiler pragma `0.8.0` used in this contract to avoid accidential bugs.

## Typographic Error (SWC-129)
Carefull check that math function of adding (+=) and substraction (-+) work correct. Verified via `test`.

## Modifiers 
All modifiers in contract validate a condition with `require` keyword.
