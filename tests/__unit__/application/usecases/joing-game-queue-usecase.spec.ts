import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

const makeSut = () => {
  const gameService = new GameService();
  const sut = new JoingGameQueueUseCase(gameService);

  return { sut, gameService };
};

describe('Join Game Queue Use Case', () => {
  it('Should not add player to the game queue if player already exists', () => {
    const { sut, gameService } = makeSut();

    const playerId = '1';
    gameService.joinQueue(playerId);

    sut.execute(playerId);

    expect(sut.execute(playerId)).toBeUndefined();
  });

  it('Should add player to the game queue if player does not already exist', () => {
    const { sut, gameService } = makeSut();

    const playerId = '1';

    sut.execute(playerId);

    expect(gameService.getPlayer(playerId)).toBeDefined();
  });
});
