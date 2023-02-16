import { KuRes_apply_ws_public_connect_token } from '@hft-forge/types/ku';

export const fixture_KuRes_apply_ws_public_connect_token: KuRes_apply_ws_public_connect_token = {
    code: "200000",
    data: {
        token: "2neAiuYvAU61ZDXANAGAsiL4-iAExhsBXZxftpOeh_55i3Ysy2q2LEsEWU64mdzUOPusi34M_wGoSf7iNyEWJ9TiUxlPuMp8XjC68YeCDmdGEccCQ7vjKtiYB9J6i9GjsxUuhPw3BlrzazF6ghq4L_pJKrnl7icPcM4MOrumKLk=.xMgimajnW_n2AXP4U3XrNA==",
        instanceServers: [
            {
                endpoint: "wss://ws-api-spot.kucoin.com/",
                encrypt: true,
                protocol: "websocket",
                pingInterval: 18000,
                pingTimeout: 10000
            },
        ],
    },
};
