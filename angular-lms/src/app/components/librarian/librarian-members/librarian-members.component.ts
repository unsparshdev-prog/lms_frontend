import { Component, OnInit } from '@angular/core';
import { Member } from '../../../models/member.model';
import { MemberService } from '../../../services/member.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-librarian-members',
  templateUrl: './librarian-members.component.html',
  styleUrls: ['./librarian-members.component.scss']
})
export class LibrarianMembersComponent implements OnInit {
  members: Member[] = [];
  form: FormGroup;
  showForm = false;

  constructor(
    private memberService: MemberService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      membershipExpiry: ['', Validators.required],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.members = this.memberService.getAllMembers();
  }

  openForm(): void {
    this.showForm = true;
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    this.form.reset({
      status: 'pending',
      membershipExpiry: d.toISOString().split('T')[0]
    });
  }

  closeForm(): void {
    this.showForm = false;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.memberService.addMember({
      name: val.name,
      email: val.email,
      phone: val.phone,
      membershipExpiry: val.membershipExpiry,
      status: val.status
    });
    this.loadMembers();
    this.closeForm();
  }

  approve(m: Member): void {
    this.memberService.approveMember(m.id);
    this.loadMembers();
  }

  reject(m: Member): void {
    this.memberService.rejectMember(m.id);
    this.loadMembers();
  }
}
