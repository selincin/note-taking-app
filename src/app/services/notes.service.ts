import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../environments/environment';
import { Note } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly RECENT_SEARCHES_KEY = 'recent-searches';
  private readonly MAX_RECENT_SEARCHES = 5;
  private headers = new HttpHeaders({
    'apikey': environment.SUPABASE_KEY,
    'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  });
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);
  public recentSearches = signal<string[]>(this.loadRecentSearches());
  public notes = signal<Note[]>([]);
  public loading = signal(false);
  public searchTerm = signal('');
  public selectedTags = signal<string[]>([]);

  // all tags
  filteredNotes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const tags = this.selectedTags();

    let result = this.notes();

    if (tags.length > 0) {
      result = result.filter(note => tags.every(tag => note.tags.includes(tag)));
    }

    if (term.length >= 3) {
      result = result.filter(note =>
        note.title.toLowerCase().includes(term) ||
        note.text.toLowerCase().includes(term) ||
        note.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    return result;
  });

  allTags = computed(() => {
    const tagSet = new Set<string>();

    for (const note of this.notes()) {
      for (const tag of note.tags) {
        tagSet.add(tag);
      }
    }

    return Array.from(tagSet);
  });

  constructor() {
    toObservable(this.searchTerm)
      .pipe(
        debounceTime(800),
        filter(term => term.trim().length >= 3)
      )
      .subscribe(term => this.addRecentSearch(term));
  }

  async fetchNotes(archived?: boolean): Promise<void> {
    this.loading.set(true);
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?select=*&archived=eq.${archived}`;

    try {
      const response = await lastValueFrom(
        this.http.get<any[]>(url, { headers: this.headers })
      );
      // sort by newest
      this.notes.set(this.sortByNewest(response.map(item => new Note(item))));

    } catch (error) {
      console.error('Fehler beim Laden der Notes:', error);
      this.toastr.error(this.translate.instant('TOASTS.FETCH_NOTES_ERROR'))

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

      if (!response.length) {
        return undefined;
      }

      const note = new Note(response[0]);
      this.notes.update(current =>
        current.some(n => n.id === note.id) ? current : this.sortByNewest([...current, note])
      );
      return note;

    } catch (error) {
      console.error('Fehler beim Laden der Note:', error);
      this.toastr.error(this.translate.instant('TOASTS.FETCH_NOTE_ERROR'))
      return undefined;
    }
  }

  async getActiveNotes(): Promise<void> {
    return this.fetchNotes(false);
  }

  async getArchivedNotes(): Promise<void> {
    return this.fetchNotes(true);
  }

  async createNote(note: { title: string; text: string; tags: string[] }): Promise<void> {
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}`;

    try {
      const response = await lastValueFrom(
        this.http.post<any[]>(url, note, {
          headers: this.headers.set('Prefer', 'return=representation')
        })
      );

      const createdNote = new Note(response[0]);
      this.notes.update(current => [createdNote, ...current]);
      this.toastr.success(this.translate.instant('TOASTS.NOTE_CREATED_SUCCESS'));

    } catch (error) {
      console.error('Fehler beim Erstellen der Note:', error);
      this.toastr.error(this.translate.instant('TOASTS.CREATE_NOTE_ERROR'))
    }
  }

  async updateNote(id: string, note: { title: string; text: string; tags: string[] }): Promise<void> {
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?id=eq.${id}`;
    const editedAt = new Date().toISOString();

    try {
      await lastValueFrom(
        this.http.patch(url, { ...note, edited_at: editedAt }, { headers: this.headers })
      );

      this.notes.update(current =>
        current.map(n => n.id === id ? new Note({ ...n, ...note, edited_at: editedAt }) : n)
      );
      this.toastr.success(this.translate.instant('TOASTS.NOTE_UPDATED_SUCCESS'));
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Note:', error);
      this.toastr.error(this.translate.instant('TOASTS.UPDATE_NOTE_ERROR'))
    }
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
      this.toastr.error(this.translate.instant('TOASTS.ARCHIVE_NOTE_ERROR'))
    }
  }

  async deleteNote(id: string): Promise<void> {
    const url = `${environment.SUPABASE_URL}${environment.API_NOTES}?id=eq.${id}`;

    try {
      await lastValueFrom(
        this.http.delete(url, { headers: this.headers })
      );

      this.notes.update(current => current.filter(n => n.id !== id));
      this.toastr.success(this.translate.instant('TOASTS.NOTE_DELETED_SUCCESS'));
    } catch (error) {
      console.error('Fehler beim Löschen der Note:', error);
      this.toastr.error(this.translate.instant('TOASTS.DELETE_NOTE_ERROR'))
    }
  }

  // =======> search & tag filter <=======

  toggleTagFilter(tagName: string) {
    this.selectedTags.update(current =>
      current.includes(tagName)
        ? current.filter(t => t !== tagName)
        : [...current, tagName]
    );
  }

  addRecentSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;

    this.recentSearches.update(current => {
      const withoutDuplicate = current.filter(t => t !== trimmed);
      const updated = [trimmed, ...withoutDuplicate].slice(0, this.MAX_RECENT_SEARCHES);

      localStorage.setItem(this.RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  clearRecentSearches() {
    this.recentSearches.set([]);
    localStorage.removeItem(this.RECENT_SEARCHES_KEY);
  }

  // ====> methods <====

  private sortByNewest(notes: Note[]): Note[] {
    return [...notes].sort((a, b) => {
      const dateA = new Date(a.edited_at ?? a.created_at).getTime();
      const dateB = new Date(b.edited_at ?? b.created_at).getTime();
      return dateB - dateA;
    });
  }

  private loadRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(this.RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}