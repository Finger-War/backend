import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';

const makeSut = () => {
  const inMemoryQueueRepository = new InMemoryQueueRepository();
  const sut = new JoingGameQueueUseCase(inMemoryQueueRepository);

  return { sut, inMemoryQueueRepository };
};

describe('Join Game Queue Use Case', () => {
  it('Should not add player to the game queue if player already exists', () => {
    const { sut, inMemoryQueueRepository } = makeSut();

    const playerId = '1';
    inMemoryQueueRepository.joinQueue(playerId);

    sut.execute(playerId);

    expect(sut.execute(playerId)).toBeUndefined();
  });

  it('Should add player to the game queue if player does not already exist', () => {
    const { sut, inMemoryQueueRepository } = makeSut();

    const playerId = '1';

    sut.execute(playerId);

    expect(inMemoryQueueRepository.getPlayer(playerId)).toBeDefined();
  });
});
