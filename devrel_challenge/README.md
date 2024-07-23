# How to test functions
1. `leo run create_private_record 100u128` to create a private record.
2. `leo run update_private_record <RECORD_CREATED_FROM_1> 222u128>` to update a private record created from previous action.
3. `leo run set_public_state "{data: 10u128, data2: 123field}"` to set public state.
4. `leo run update_public_state "{data: 33u128, data2: 333field}"` to update (increment) public state.