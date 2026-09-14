import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Note } from '../models/note.model';
import { NotesFilter } from '../models/notes-filter.enum';

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

  async fetchNotes(archived?: boolean): Promise<void> {
    this.loading.set(true);
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?select=*&archived=eq.${archived}`;

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

  async getActiveNotes(): Promise<void> {
    return this.fetchNotes(false);
  }

  async getArchivedNotes(): Promise<void> {
    return this.fetchNotes(true);
  }

  async toggleArchive(note: Note): Promise<void> {
    const newArchivedState = !note.archived;
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?id=eq.${note.id}`;

    try {
      await lastValueFrom(
        this.http.patch(url, { archived: newArchivedState }, { headers: this.headers })
      );
      this.notes.update(current => current.filter(n => n.id !== note.id));
    } catch (error) {
      console.error('Fehler beim Ändern des Archiv-Status:', error);
    }
  }

  async deleteNote(id: string): Promise<void> {
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?id=eq.${id}`;

    try {
      await lastValueFrom(
        this.http.delete(url, { headers: this.headers })
      );

      this.notes.update(current => current.filter(n => n.id !== id));
    } catch (error) {
      console.error('Fehler beim Löschen der Note:', error);
    }
  }

}