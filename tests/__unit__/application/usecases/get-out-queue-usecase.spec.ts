import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

const makeSut = () => {
  const gameService = new GameService();
  const sut = new GetOutQueueUseCase(gameService);

  return { sut, gameService };
};

describe('Get Out Queue Use Case', () => {
  it('Should not remove player from the game queue if player does not exist', () => {
    const { sut } = makeSut();

    const playerId = '1';

    expect(sut.execute(playerId)).toBeUndefined();
  });

  it('Should remove player from the game queue if player exist', () => {
    const { sut, gameService } = makeSut();

    const playerId = '1';
    gameService.joinQueue(playerId);

    sut.execute(playerId);

    expect(gameService.getPlayer(playerId)).toBeDefined();
  });
});
