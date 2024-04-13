import { Test } from '@nestjs/testing';

import { Match } from '@/domain/entities/match';

import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';

describe('In Memory Match Repository', () => {
  let repository: InMemoryMatchRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [InMemoryMatchRepository],
    }).compile();

    repository = moduleRef.get<InMemoryMatchRepository>(
      InMemoryMatchRepository,
    );
  });

  describe('add', () => {
    it('Should add a match to the repository', () => {
      const match = { id: '1', players: [] } as Match;

      repository.add(match);

      expect(repository['match']).toContain(match);
    });
  });
});
