interface IEnvs {
  CONTAINER_PORT: number;
}

export const envs: IEnvs = {
  CONTAINER_PORT: parseInt(process.env.PORT, 10) || 4000,
};
