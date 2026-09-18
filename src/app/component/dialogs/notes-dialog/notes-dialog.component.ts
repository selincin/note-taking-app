import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { Note } from '../../../models/note.model';
import { NotesService } from '../../../services/notes.service';

@Component({
  selector: 'app-notes-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './notes-dialog.component.html',
  styleUrl: './notes-dialog.component.css',
})
export class NotesDialogComponent {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NotesDialogComponent>);
  private notesService = inject(NotesService);

  public data: { note?: Note } = inject(MAT_DIALOG_DATA) ?? {};
  private readonly initialTitle = this.data.note?.title ?? '';
  private readonly initialText = this.data.note?.text ?? '';
  private readonly initialTags = this.data.note?.tags ?? [];

  public isEditMode = Boolean(this.data.note);
  public noteForm = this.formBuilder.group({
    title: [this.initialTitle, Validators.required],
    text: [this.initialText, Validators.required],
  });
  public tags = signal<string[]>(this.initialTags);

  private formValue = toSignal(this.noteForm.valueChanges, {
    initialValue: this.noteForm.value,
  });

  public hasChanges = computed(() => {
    const current = this.formValue();
    const titleChanged = current.title !== this.initialTitle;
    const textChanged = current.text !== this.initialText;
    const tagsChanged = !this.sameTags(this.tags(), this.initialTags);

    return titleChanged || textChanged || tagsChanged;
  }); 

  public saveDisabled = computed(() => {
    const values = this.formValue();
    const changed = this.hasChanges();

    const formInvalid = values.title?.trim() && values.text?.trim() ? false : true;

    if (!this.isEditMode) {
      return formInvalid;
    }

    return formInvalid || !changed;
  });

  public addTag(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update(current => {
        const updated = [...current]; 
        updated.push(value);
        return updated;
      });
    }
    event.chipInput!.clear();
  }

  public removeTag(tag: string) {
    this.tags.update(current => current.filter(t => t !== tag));
  }
  public async onSave() {
    if (this.saveDisabled()) return;

    try {
      if (this.isEditMode) {
        await this.notesService.updateNote(this.data.note!.id, {
          title: this.noteForm.value.title!,
          text: this.noteForm.value.text!,
          tags: this.tags(),
        });
      } else {
        await this.notesService.createNote({
          title: this.noteForm.value.title!,
          text: this.noteForm.value.text!,
          tags: this.tags(),
        });
      }

      this.dialogRef.close();
    } catch (error) {
      console.error('Note konnte nicht gespeichert werden:', error);
    }
  }

  public onCancel() {
    this.dialogRef.close();
  }

  private sameTags(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((tag, i) => tag === b[i]);
  }
}