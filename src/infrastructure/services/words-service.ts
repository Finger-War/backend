import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';

interface IWordsService {
  generateRandomWords(): Promise<string[]>;
}

@Injectable()
export class WordsService implements IWordsService {
  private readonly baseUrl = 'https://pt.wikipedia.org';

  constructor(private readonly httpService: HttpService) {}

  async generateRandomWords(): Promise<string[]> {
    const randomSummary = await this.fetchRandomSummary();
    const pageid = randomSummary.pageid;

    const randomWords = await this.fetchRandomWords(pageid);
    const text = randomWords.query.pages[pageid].extract;

    return this.extractRandomWords(text);
  }

  private async fetchRandomSummary(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/api/rest_v1/page/random/summary`),
    );

    return data;
  }

  private async fetchRandomWords(pageid: number): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/w/api.php?action=query&format=json&pageids=${pageid}&prop=extracts&exintro=true&origin=*`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return data;
  }

  private extractRandomWords(text: string): string[] {
    const textWithoutHtmlTags = text.replace(/<\/?[^>]+(>|$)/g, ' ');
    const textWithoutHtmlEntities = textWithoutHtmlTags.replace(
      /&[a-z]+;/gi,
      '',
    );
    const textWithoutPunctuation = textWithoutHtmlEntities.replace(
      /[^\w\s]|_/gi,
      '',
    );
    const textWithoutNumbers = textWithoutPunctuation.replace(/\d+/g, '');
    const textWithoutMultipleSpaces = textWithoutNumbers.replace(/\s+/g, ' ');

    const arrayWords = textWithoutMultipleSpaces.split(' ');

    const randomWords = Array.from(
      { length: arrayWords.length },
      () => arrayWords[Math.floor(Math.random() * arrayWords.length)],
    );

    return randomWords;
  }
}
