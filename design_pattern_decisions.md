# Design Pattern Decisions 
This is a list of design patterns applied in this project

## Access Control Design Pattern
- Smart contract has function with restricted access to `Only Owner`. For example, 'Only Owner' can call `pause()` or `unpause()` function to act with contract in emergency cases.

## Inheritance
- StepCoin smart contract inherits a library `Ownable` from OpenZeppelin to control access of this contract. This library is audited and secured, which add extra safety for this current project.
