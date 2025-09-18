# tato-cardcds

A simple TERA mod that tracks card cooldowns for cards with known cooldown timers.

## Supported Cards

### 60 Second Cooldown Cards
- **30000013**: Physical Resistance Increase (+1400 for 5s)
- **30000014**: Magic Resistance Increase (+1400 for 5s)
- **30000015**: Minor Physical Burst (+700 amp for 5s)
- **30000016**: Minor Magic Burst (+700 amp for 5s)
- **30000017**: Crit Factor Increase (+12 for 10s)
- **30000024**: Increased Crit Power (+0.01 for 30s)

### 180 Second (3 Minute) Cooldown Cards
- **30000019**: Magic and Physical Amplification (+3000 for 30s)
- **30000020**: Magic and Physical Resistance (+1500 for 30s)
- **30000021**: Magic and Physical Resistance (+1500 for 30s)
- **30000022**: Magic and Physical Amplification (+1500 for 30s)
- **30000023**: Increased Crit Power (+0.02 for 30s)

### Normal Operation
The mod works automatically once loaded:
- **Green "activated" message** appears when a card procs
- **Cooldown timer** starts showing remaining time as a buff icon (note: this is simplified by "simplify other effects")
- **White "ready" message** appears when the card is available again

### Debug Mode
Toggle debug information with:
```
/cardcds debug
```

Debug mode shows detailed information about:
- Card activation events
- Buff durations and cooldown calculations
- Timer start/stop events
- Card refresh and end events

## Credits

- **Original dragoncds concept**: Mela

---

*This mod only tracks cards with known, explicit cooldowns. Cards without specified cooldowns are not included.*
