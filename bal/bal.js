function generatePdf() {
	const { jsPDF } = window.jspdf;
	var doc = new jsPDF("portrait");
	
	let listeRecupereeString = localStorage.getItem("etiquettes");
	let personnes = JSON.parse(listeRecupereeString);

	var index = 0;
	var hauteur = 26; // 26mm
	var largeur = 102; // 97mm
	var marge = 20;
	var numWidth = 18;
	var position = 0;
	for (const bal of personnes) {
		if (index>0 && index%10 === 0 ) {
			doc.addPage();
			position = 0;
		}
		doc.setLineWidth(0);
		doc.setDrawColor('#000000');
		doc.line(marge, hauteur*position+marge, largeur+marge, hauteur*position+marge);
		doc.line(marge, hauteur*(position+1)+marge, largeur+marge, hauteur*(position+1)+marge);
		doc.line(marge, hauteur*position+marge, marge, hauteur*(position+1)+marge);
		doc.line(largeur+marge, hauteur*position+marge, largeur+marge, hauteur*(position+1)+marge);
		doc.line(numWidth+marge, hauteur*position+marge, numWidth+marge, hauteur*(position+1)+marge);
		
		// Numéro
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(0,0,0);
		doc.setFontSize(16);
		doc.text(bal.numero, marge+numWidth/2, hauteur*position+marge+hauteur/2, { align: 'center', baseline: 'middle' });
		
		// Nom
		var decalageHauteur = 15;
		if (!isNullOrEmpty(bal.ligne2) || !isNullOrEmpty(bal.ligne3)) {
			if (!isNullOrEmpty(bal.ligne2) && !isNullOrEmpty(bal.ligne3)) {
				decalageHauteur = 7;
			} else {
				decalageHauteur = 11.5;
			}
		}
		doc.setFont('helvetica', 'bold')
		doc.setFontSize(getFontSizeForLigne(bal.ligne1, bal.stopPub));
		doc.text(bal.ligne1, marge+20, hauteur*position+marge+decalageHauteur);
		if (!isNullOrEmpty(bal.ligne2)) {
			doc.setFontSize(getFontSizeForLigne(bal.ligne2, bal.stopPub));
			decalageHauteur+=8;
			doc.text(bal.ligne2, marge+20, hauteur*position+marge+decalageHauteur);
		}
		if (!isNullOrEmpty(bal.ligne3)) {
			doc.setFontSize(getFontSizeForLigne(bal.ligne3, bal.stopPub));
			decalageHauteur+=8;
			doc.text(bal.ligne3, marge+20, hauteur*position+marge+decalageHauteur);
		}
		
		// Stop pub
		if (bal.stopPub) {
			doc.setTextColor(255,0,0);
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(12);
			var posx = 84;
			var posy = 10;
			doc.text('STOP', marge+posx+2, hauteur*position+marge+posy+5.5);
			doc.text('PUB', marge+posx+3, hauteur*position+marge+posy+9.5);
			doc.setDrawColor('#FF0000');
			doc.setLineWidth(0.6);
			//doc.rect(marge+posx, hauteur*position+marge+posy, 15, 12.5, 'D');
			doc.circle(marge+posx+7.5, hauteur*position+marge+posy+5.5, 7, 'D');
		}
		index++;
		position++;
	}
	// FIN
	var string = doc.output('datauristring');
	var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
	var x = window.open();
	x.document.open();
	x.document.write(iframe);
	x.document.close();
}

function getFontSizeForLigne(texte, stopPub) {
	return 15;
	if (texte.length > 18 && stopPub) {
		return 16;
	}
	if (texte.length > 23) {
		return 16;
		if (texte.length > 28) {
			return 12;
		}
	}
	return 16;
}

function isNullOrEmpty(str) {
	return str === null || str === undefined || str.trim() === '';
}