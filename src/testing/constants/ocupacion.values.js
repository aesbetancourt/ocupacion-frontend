const activitie_1 = { 
    act_clockify_task: "5eff8ae1060ecb299fb23873",
    act_description: "1234",
    act_id: 1,
    act_portfolio: 0,
    act_status: 1,
    act_title: "Prueba 1",
    cli_id: 2,
    clients: {cli_id: 2, cli_name: "Cli2", cli_description: "Cli2......", cli_icon: "Cli2Icon", cli_status: 1},
    key: "0-1",
    por_id: null,
    portfolio_requests: null
}
const activitie_2 = { 
    act_clockify_task: "5eff8ae1060ecb299fb23873",
    act_description: "1234",
    act_id: 2,
    act_portfolio: 0,
    act_status: 1,
    act_title: "Prueba 2",
    cli_id: 2,
    clients: {cli_id: 2, cli_name: "Cli2", cli_description: "Cli2......", cli_icon: "Cli2Icon", cli_status: 1},
    key: "0-2",
    por_id: null,
    portfolio_requests: null
}
const client_1 = {
    cli_description: "Cli1......",
    cli_icon: "Cli1Icon",
    cli_id: 1,
    cli_name: "Cli1",
    cli_status: 1
}
const client_2 = {
    cli_description: "Cli2......",
    cli_icon: "Cli2Icon",
    cli_id: 2,
    cli_name: "Cli2",
    cli_status: 1
}
const sync = [{
    dataSource: [activitie_1, activitie_2],
    total: 2,
    clients: [client_1, client_2],
    loading: false
}]
const clockifyDataSource = {
    clients: [
      {id: 1, name: "cli_1"},
      {id: 2, name: "cli_2"}
    ],
    projects: [
      {id: 3, name: "proy_3"},
      {id: 4, name: "proy_4"}
    ],
    tasks: [
      {id: 5, name: "task_5"},
      {id: 6, name: "task_6"}
    ]
}
const dataSet = {
    activitie_1,
    activitie_2,
    client_1,
    client_2,
    sync,
    clockifyDataSource
}
export default dataSet