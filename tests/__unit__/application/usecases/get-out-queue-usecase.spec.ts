import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

describe('Get Out Queue Use Case', () => {
  it('Should not remove player from the game queue if player does not exist', () => {
    const playerId = '1';
    const gameService = new GameService();
    const sut = new GetOutQueueUseCase(gameService);

    expect(sut.execute(playerId)).toBeUndefined();
  });
});
