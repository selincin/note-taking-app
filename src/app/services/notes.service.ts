import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  notes = signal<Note[]>([]);
  loading = signal(false);

  private headers = new HttpHeaders({
    'apikey': environment.SUPABASE_KEY,
    'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  async getNotes(): Promise<void> {
    this.loading.set(true);
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?select=*`;

    try {
      const response = await lastValueFrom(
        this.http.get<any[]>(url, { headers: this.headers })
      );
      this.notes.set(response.map(item => new Note(item)));

    } catch (error) {
      console.error('Fehler beim Laden der Notes:', error);

    } finally {
      this.loading.set(false);
    }
  }

  async getNoteById(id: string): Promise<Note | undefined> {
  const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?id=eq.${id}&select=*`;

  try {
    const response = await lastValueFrom(
      this.http.get<any[]>(url, { headers: this.headers })
    );
    return response.length > 0 ? new Note(response[0]) : undefined;
  } catch (error) {
    console.error('Fehler beim Laden der Note:', error);
    return undefined;
  }
}
}