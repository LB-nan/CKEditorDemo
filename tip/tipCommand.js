import Command from '@ckeditor/ckeditor5-core/src/command';

export default class tipCommand extends Command {
  execute() {
    this.editor.model.change(writer => {
      this.editor.model.insertContent(createTip(writer));
    });
  }
}

function createTip(writer) {
  const editItemBox = writer.createElement('editItemBox');
  const tipContentBox = writer.createElement('tipContentBox');
  const tipTitle = writer.createElement('tipTitle');
  const tipContent = writer.createElement('tipContent');

  const tipClose = writer.createElement('tipClose');
  const span = writer.createElement('tipSpan');
  writer.insertText('x', writer.createPositionAt(span, 0));
  writer.append(span, tipClose);

  const paragraph = writer.createElement('paragraph');
  writer.appendText('title', paragraph);

  const paragraph1 = writer.createElement('paragraph');
  writer.appendText('1. Drink more water', paragraph1);
  const paragraph2 = writer.createElement('paragraph');
  writer.appendText('2. Drink more hot water', paragraph2);
  writer.insert(paragraph, tipTitle, 0);
  writer.insert(paragraph1, tipContent, 0);
  writer.insert(paragraph2, tipContent, 1);
  writer.append(tipContent, tipContentBox);
  writer.append(tipClose, tipContentBox);
  writer.append(tipTitle, tipContentBox);
  writer.append(tipContentBox, editItemBox);

  return editItemBox;
}