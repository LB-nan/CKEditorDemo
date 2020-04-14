import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';


export default class tipUi extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;
    editor.ui.componentFactory.add('tip', locale => {
      const view = editor.editing.view;
      const command = editor.commands.get('tip');
      view.addObserver(ClickObserver);
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t('tip'),
        tooltip: true,
        withText: true
      });
      buttonView.bind('isOn', 'tip').to(command, 'value', 'isEnabled');

      this.listenTo(buttonView, 'execute', () => editor.execute('tip'));
      return buttonView;
    });
  }
}