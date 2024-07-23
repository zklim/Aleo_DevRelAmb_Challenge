// The 'devrel_challenge_233' program.
program devrel_challenge_233.aleo {
    record Record {
        owner: address,
        data: u128,
    }

    struct State {
        data: u128,
        data2: field,
    }

    mapping state: u128 => State;

    transition create_private_record(data: u128) -> Record {
        return Record {
            owner: self.caller,
            data: data,
        };
    }

    transition update_private_record(input: Record, data: u128) -> Record {
        return Record {
            owner: input.owner,
            data: data
        };
    }

    async transition set_public_state(key: u128, state_: State) -> Future {
        return update_public_state_internal(key, state_);
    }

    async transition update_public_state(key: u128, state_: State) -> Future {
        return update_public_state_internal(key, state_);
    }

    async function update_public_state_internal(key: u128, state_: State) {
        let prev: State = state.get_or_use(key, State {
            data: 0u128, 
            data2: 0field,
        });

        state.set(key, State {
            data: prev.data + state_.data,
            data2: prev.data2 + state_.data2,
        });
    }
}
