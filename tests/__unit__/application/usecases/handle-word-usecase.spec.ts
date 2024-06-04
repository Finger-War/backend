import { Test, TestingModule } from '@nestjs/testing';
import { WsException } from '@nestjs/websockets';

import { HandleWordUseCase } from '@/application/usecases/handle-word-usecase';
import { GameConstants } from '@/main/constants/game-constants';
import { Server, Socket } from 'socket.io';
import { vi, describe, it, expect } from 'vitest';

const makeSut = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [HandleWordUseCase],
  }).compile();

  const sut = module.get<HandleWordUseCase>(HandleWordUseCase);

  return { sut };
};

const makeClientMock = (): Socket =>
  ({
    id: 'any_player_one',
    rooms: new Set<string>(),
    to: vi.fn().mockReturnThis(),
    emit: vi.fn(),
  }) as unknown as Socket;

const makeServerMock = (): Server =>
  ({
    sockets: {
      adapter: {
        rooms: new Map<string, Set<string>>(),
      },
    },
  }) as unknown as Server;

describe('Handle Word Use Case', () => {
  it('Should throw a Websockets Exception if client is not in a match room', async () => {
    const { sut } = await makeSut();

    const client = makeClientMock();
    const server = makeServerMock();

    expect(() => sut.execute(server, client, 'any_word')).toThrow(WsException);
  });

  it('Should throw a Websockets Exception if there is no adversary in the room', async () => {
    const { sut } = await makeSut();

    const client = makeClientMock();
    const server = makeServerMock();

    client.rooms.add('match:any_room');

    server.sockets.adapter.rooms.set(
      'match:any_room',
      new Set<string>(['any_player_one']),
    );

    expect(() => sut.execute(server, client, 'any_word')).toThrow(WsException);
  });

  it('Should emit the word to the adversary if both clients are in the match room', async () => {
    const { sut } = await makeSut();

    const client = makeClientMock();
    const server = makeServerMock();

    client.rooms.add('match:any_room');

    server.sockets.adapter.rooms.set(
      'match:any_room',
      new Set<string>(['any_player_one', 'any_player_two']),
    );

    sut.execute(server, client, 'any_word');

    expect(client.to).toHaveBeenCalledWith('any_player_two');
    expect(client.emit).toHaveBeenCalledWith(
      GameConstants.client.adversaryWords,
      'any_word',
    );
  });
});
