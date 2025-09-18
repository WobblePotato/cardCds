// 
// tato-cardcds
// Card cooldown tracker for TERA
// Tracks cards with known cooldowns

// Only cards with explicit cooldowns
const cardbuff = [30000013, 30000014, 30000015, 30000016, 30000017, 30000019, 30000020, 30000021, 30000022, 30000023, 30000024];

// Card cooldown mapping (in milliseconds)
const cardCooldowns = {
    // 60 second cooldown cards
    30000013: 60000, // Physical Resistance Increase
    30000014: 60000, // Magic Resistance Increase
    30000015: 60000, // Minor Physical Burst
    30000016: 60000, // Minor Magic Burst
    30000017: 60000, // Crit Factor Increase
    30000024: 60000, // Increased Magic and Physical Crit Power (0.01) - 1 min
    
    // 3 minute (180 second) cooldown cards
    30000019: 180000, // Magic and Physical Amplification (3000)
    30000020: 180000, // Magic and Physical Resistance (1500) 
    30000021: 180000, // Magic and Physical Resistance (1500)
    30000022: 180000, // Magic and Physical Amplification (1500)
    30000023: 180000  // Increased Magic and Physical Crit Power (0.02) - 3 min
	// Debug toggle command
	mod.command.add('cardcds', (arg) => {
		if(arg === 'debug') {
			debug = !debug;
			mod.command.message(`Card CD debug mode ${debug ? 'enabled' : 'disabled'}`);
		}
	});
};

module.exports = function cardcds(mod) {
	
	let enabled = true;
	let debug = false; // Debug mode toggle
	let activeCards = {};
	let cardTimers = {};
	
    mod.hook('S_ABNORMALITY_BEGIN', 4, event => {
		// Handle card procs
		if(enabled && mod.game.me.is(event.target) && cardbuff.includes(event.id)) {
			const cardId = Number.parseInt(event.id);
			const buffDuration = Number.parseInt(event.duration);
			const cooldownDuration = cardCooldowns[cardId] || 60000; // Default to 60s if not found
			const remainingCooldown = cooldownDuration - buffDuration;
			
			activeCards[cardId] = Date.now() + event.duration;
			
			// Show card proc message
//			uwu(`<font size="20" color="#ffffff">Card ${getCardName(cardId)} activated!</font>`);
			
			// Debug message
			if(debug) {
				mod.command.message(`[DEBUG] Card ${cardId} activated. Buff: ${buffDuration}ms, Cooldown: ${cooldownDuration}ms, Remaining: ${remainingCooldown}ms`);
			}
			
			setTimeout(function () {
				card_start(cardId, remainingCooldown);
			}, buffDuration + 100);
		}
	});
	
	mod.hook('S_ABNORMALITY_REFRESH', 1, (event) => {
		if(enabled && mod.game.me.is(event.target) && cardbuff.includes(event.id)) {
            activeCards[event.id] = Date.now() + event.duration.toString;
			if(debug) {
				mod.command.message(`[DEBUG] Card ${event.id} refreshed`);
			}
		}
    });
	
	mod.hook('S_ABNORMALITY_END', 1, (event) => {
		if(enabled && mod.game.me.is(event.target) && cardbuff.includes(event.id)) {
            delete activeCards[event.id];
			if(debug) {
				mod.command.message(`[DEBUG] Card ${event.id} ended`);
			}
		}
    });
	
	// Card cooldown tracking function
	function card_start(cardId, duration) {
        mod.send('S_ABNORMALITY_BEGIN', 4, {
            target: mod.game.me.gameId,
            source: mod.game.me.gameId,
            id: cardId,
            duration: duration,
            stacks: 1
        });
        
        if(debug) {
			mod.command.message(`[DEBUG] Starting cooldown timer for card ${cardId}, duration: ${duration}ms`);
		}
        
        let timer = setTimeout(() => {
            mod.send('S_ABNORMALITY_END', 1, {
                target: mod.game.me.gameId,
                id: cardId
            });
            
            // Notify when card is ready again
//            owo(`<font size="20" color="#ffffff">Card ${getCardName(cardId)} ready!</font>`);
			mod.command.message(`[DEBUG] Card ${cardId} cooldown finished`);
        }, duration);
        
        cardTimers[cardId] = timer;
    }
	
	// Helper function to get card names
	function getCardName(cardId) {
		const cardNames = {
			30000013: "Phys Resistance",
			30000014: "Magic Resistance",
			30000015: "Minor Phys Burst",
			30000016: "Minor Magic Burst",
			30000017: "Crit Factor+",
			30000019: "Major Amplification",
			30000020: "Major Resistance",
			30000021: "Major Resistance",
			30000022: "Amplification",
			30000023: "Major Crit Power",
			30000024: "Crit Power"
		};
		return cardNames[cardId] || `#${cardId}`;
	}
	
    mod.game.on('leave_game', () => {
        // Clear all timers
        for (let i in cardTimers) {
            clearTimeout(cardTimers[i]);
        }
        cardTimers = {};
        activeCards = {};
		if(debug) {
			mod.command.message(`[DEBUG] Cleared all card timers on leave_game`);
		}
    });

	// Display functions
	function uwu(msg) {
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: 43, // 42 - 43 - 48
			chat: false,
			channel: 0,
			message: msg
		});
	}	
	
	function owo(msg) {
		mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
			type: 42,
			chat: 0,
			channel: 0,
			message: msg
		});
	}
}