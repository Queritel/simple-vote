import { Component, OnInit, Input } from '@angular/core';

import { Candidate, Tools, MessageType, Vote, QuestionType } from '../../shared';

import { PollService, UserService } from '../../services';

import {randomColor} from 'randomcolor';

@Component({
	selector: 'app-candidate',
	templateUrl: './candidate.component.html',
	styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {

	@Input() candidate: Candidate;
	@Input() expired: boolean;
	@Input() anonymous: boolean;
	@Input() questionType: QuestionType;

	public vote: number;

	public showDetails: boolean = false;
	public backgroundColor: string;

	constructor(private pollService: PollService,
		private userService: UserService) { }

	ngOnInit() {
		this.backgroundColor = randomColor();
	}

	ngOnChanges(changes: any) {
		//  && changes.candidate.firstChange
		// if (changes.candidate) {
		// 	console.log(changes.candidate.currentValue);
		// 	console.log(changes.candidate.currentValue.votes);
			// setTimeout(() => {
			// 	this.setMyVote();
			// }, 500);
		// }
	}
	ngAfterContentChecked() {
		console.log('votes from afterContentChecked' + this.candidate.votes);
		this.setMyVote();
	}

	ngDoCheck() {
		console.log('votes from ngDoCheck' + this.candidate.votes);
	}

	toggleDetails() {
		this.showDetails = !this.showDetails;
	}

	toggleEditing() {
		this.candidate.editing = !this.candidate.editing;
	}

	detailsExpander() {
		return (this.showDetails) ? '[-]' : '[+]';
	}


	deleteCandidate() {
		this.pollService.send(Tools.messageWrapper(MessageType.deleteCandidate,
			{
				question_id: this.candidate.question_id,
				candidate_id: this.candidate.id
			}));
	}

	updateCandidate() {
		this.pollService.send(Tools.messageWrapper(MessageType.updateCandidate,
			this.candidate));
		this.candidate.editing = false;
	}

	setMyVote() {
		if (this.candidate.votes) {
			let foundVote = this.candidate.votes.find(v => v.user_id == this.userService.getUser().id);
			if (foundVote) {
				this.vote = foundVote.vote;
			}
		}
	}

	createOrUpdateVote(val: number) {
		this.vote = val;
		this.pollService.send(Tools.messageWrapper(MessageType.createOrUpdateVote,
			{
				candidate_id: this.candidate.id,
				question_id: this.candidate.question_id,
				user_id: Number(this.userService.getUser().id),
				vote: Number(val) // cast vote to a number
			}));
	}

	deleteVote() {
		this.vote = null;
		this.pollService.send(Tools.messageWrapper(MessageType.deleteVote,
			{
				candidate_id: this.candidate.id,
				question_id: this.candidate.question_id,
				user_id: Number(this.userService.getUser().id),
			}));
	}

	voteAvg(decimals: number = 2): string {
		return (this.candidate.avg_score !== undefined) ? (this.candidate.avg_score/10).toFixed(decimals).toString() : 'none';
	}

	voteCount(): string {
		return (this.candidate.votes) ? this.candidate.votes.length.toString() : '0';
	}

}
