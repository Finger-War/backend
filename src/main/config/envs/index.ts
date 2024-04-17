interface IEnvs {
  HTTP_PORT: number;
  WS_PORT: number;
}

export const envs: IEnvs = {
  HTTP_PORT: parseInt(process.env.PORT, 10) || 4000,
  WS_PORT: parseInt(process.env.PORT, 10) || 5000,
};
