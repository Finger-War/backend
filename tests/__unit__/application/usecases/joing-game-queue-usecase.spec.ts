import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

describe('JoinGameQueueUseCase', () => {
  let useCase: JoingGameQueueUseCase;
  let gameService: GameService;

  beforeEach(() => {
    gameService = new GameService();
    useCase = new JoingGameQueueUseCase(gameService);
  });

  it('Should not add player to the game queue if player already exists', () => {
    const playerId = 'player1';
    gameService.joinQueue(playerId);

    useCase.execute(playerId);

    expect(gameService.getPlayer(playerId)).toBeDefined();
  });
});
