// ==UserScript==
// @name         GAS Status Code Toolbar
// @description  Salvar estado DropDown de Blocos de Códigos + Toolbar com picker de ícones Lazy Load, busca, drag, auto-save, CSP safe.
// @author       Bitts [github.com/bitts](mbitts.com)
// @copyright    2025, Bitts [github.com/bitts](mbitts.com)
// @namespace    https://mbitts.com
// @homepageURL  https://github.com/bitts/GAS-Status-Code-Toolbar
// @supportURL   https://github.com/bitts/GAS-Status-Code-Toolbar/issues
// @updateURL    https://raw.githubusercontent.com/bitts/GAS-Status-Code-Toolbar/refs/heads/main/GAS-Status-Code-Toolbar.user.js
// @downloadURL  https://raw.githubusercontent.com/bitts/GAS-Status-Code-Toolbar/refs/heads/main/GAS-Status-Code-Toolbar.user.js
// @icon         https://www.gstatic.com/script/apps_script_1x_24dp.png
// @version      1.0.0
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://script.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue

// ==/UserScript==


class CheckUpdate{

    constructor() {
        this.DEBUG = false;
        this.CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // Verificar a cada 24 horas (em milissegundos)
        this.LAST_CHECK_KEY = 'lastScriptUpdateCheck';

        this.lang = langs[document.documentElement.lang ?? 'pt-BR'];

        this.checkForUpdates();
    }

    msg(txt, type){
        if(this.DEBUG){
            var script = GM_info.script.name || 'Scripts by Bitts';
            txt = `[${script}](${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}) ${txt}`;
            switch(type){
                case 'debug':
                    console.debug(txt)
                    break;
                case 'info':
                    console.info(txt)
                    break;
                case 'log':
                    console.log(txt);
                    break;
                case 'warn':
                    console.warn(txt);
                    break;
                case 'error':
                    console.error(txt);
                    break;
                default:
                    console.log(txt);
                    break;
            }
        }
    }

    checkForUpdates() {
        const th = this;
        try{
            const lastCheck = GM_getValue(th.LAST_CHECK_KEY, 0);
            const now = Date.now();
            const nameScript = GM_info.script.name || 'Scripts by Bitts';

            if (now - lastCheck < th.CHECK_INTERVAL_MS) {
                th.msg(th.lang.upt_syst_no + new Date(lastCheck + th.CHECK_INTERVAL_MS).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
                return; // Não verifica se o intervalo não passou
            }

            GM_setValue(th.LAST_CHECK_KEY, now); // Atualiza o timestamp da última verificação

            const currentVersion = GM_info.script.version;
            const updateURL = GM_info.script.updateURL || GM_info.script.downloadURL;

            if (!updateURL) {
                th.msg(th.lang.tmp_defi_no, 'warn');
                return;
            }

            th.msg(th.lang.tmp_scpt_st.replace('[nameScript]', nameScript).replace('[currentVersion]',currentVersion).replace('[updateURL]', updateURL));

            GM_xmlhttpRequest({
                method: 'GET',
                url: updateURL,
                onload: function(response) {
                    if (response.status === 200) {
                        const remoteScriptContent = response.responseText;
                        const remoteVersionMatch = remoteScriptContent.match(/@version\s+([^\n]+)/);
                        if (remoteVersionMatch && remoteVersionMatch[1]) {
                            const remoteVersion = remoteVersionMatch[1].trim();
                            if (th.compareVersions(currentVersion, remoteVersion) < 0) {
                                //th.msg(`Nova versão disponível: ${remoteVersion} / Sua versão: (${currentVersion})`);
                                GM_notification({
                                    title: th.lang.tmp_scpt_tt,
                                    text: th.lang.tmp_scpt_mg.replace('[remoteVersion]', remoteVersion).replace('[nameScript]', nameScript ),
                                    onclick: function() {
                                        window.open(updateURL, '_blank'); // Abre a URL para que o Tampermonkey possa instalar a atualização
                                    }
                                });
                            } else th.msg(`${th.lang.tmp_scpt_ok} ${currentVersion}`);
                        } else th.msg(th.lang.tmp_tgvs_no,'warn');
                    } else th.msg(`${th.lang.tmp_down_no} ${response.status}`,'error');
                },
                onerror: function(error) {
                    console.error(th.tmp_hrxd_no, error);
                }
            });
        }catch(e){
            th.msg(e)
        }
    }

    // metodo para comparar versões (ex: "1.0.1" vs "1.1.0")
    compareVersions(v1, v2) {
        var parts1 = v1.split('.').map(Number);
        var parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            let p1 = parts1[i] || 0;
            let p2 = parts2[i] || 0;

            if (p1 < p2)return -1; // v1 é menor que v2 (v2 é mais novo)
            if (p1 > p2)return 1; // v1 é maior que v2 (v1 é mais novo ou igual)
        }
        return 0; // Versões são iguais
    }
}


(function() {
  'use strict';

  try{ new CheckUpdate();} catch (e){ console.error(`Erro ao verificar por atualizações.`, e); }

  // ⚙️ Lista de ícones
  const allIcons = ['search', 'home', 'account_circle', 'settings', 'done', 'info', 'check_circle', 'delete', 'visibility', 'shopping_cart', 'favorite', 'description', 'logout', 'favorite_border', 'lock', 'schedule', 'language', 'help_outline', 'face', 'verified', 'manage_accounts', 'thumb_up', 'filter_alt', 'event', 'dashboard', 'fingerprint', 'list', 'check_circle_outline', 'visibility_off', 'login', 'calendar_today', 'highlight_off', 'help', 'paid', 'task_alt', 'question_answer', 'date_range', 'article', 'open_in_new', 'shopping_bag', 'lightbulb', 'credit_card', 'history', 'perm_identity', 'trending_up', 'account_balance', 'delete_outline', 'verified_user', 'fact_check', 'assignment', 'report_problem', 'star_rate', 'calendar_month', 'arrow_right_alt', 'account_balance_wallet', 'autorenew', 'build', 'view_list', 'store', 'work', 'print', 'analytics', 'delete_forever', 'today', 'admin_panel_settings', 'lock_open', 'watch_later', 'grade', 'update', 'savings', 'room', 'code', 'add_shopping_cart', 'contact_support', 'receipt', 'power_settings_new', 'done_all', 'pets', 'explore', 'bookmark', 'account_box', 'note_add', 'pending_actions', 'reorder', 'bookmark_border', 'shopping_basket', 'payment', 'launch', 'touch_app', 'drag_indicator', 'supervisor_account', 'pending', 'zoom_in', 'assessment', 'leaderboard', 'thumb_up_off_alt', 'open_in_full', 'preview', 'done_outline', 'assignment_ind', 'published_with_changes', 'exit_to_app', 'card_giftcard', 'view_in_ar', 'tips_and_updates', 'feedback', 'label', 'swap_horiz', 'timeline', 'stars', 'assignment_turned_in', 'sync_alt', 'dns', 'work_outline', 'flight_takeoff', 'alarm', 'space_dashboard', 'cached', 'contact_page', 'bug_report', 'book', 'rocket_launch', 'translate', 'gavel', 'question_mark', 'edit_calendar', 'pan_tool', 'supervised_user_circle', 'minimize', 'extension', 'android', 'record_voice_over', 'get_app', 'accessibility', 'add_task', 'hourglass_empty', 'help_center', 'trending_flat', 'rule', 'thumb_down', 'accessibility_new', 'ads_click', 'swap_vert', 'settings_applications', 'source', 'sticky_note_2', 'find_in_page', 'dashboard_customize', 'arrow_circle_right', 'redeem', 'loyalty', 'support', 'announcement', 'close_fullscreen', 'flutter_dash', 'restore', 'view_headline', 'currency_exchange', 'dangerous', 'euro_symbol', 'sensors', 'group_work', 'table_view', 'compare_arrows', 'disabled_by_default', 'subject', 'privacy_tip', 'nightlight_round', 'bookmarks', 'arrow_circle_up', 'https', 'toc', 'track_changes', 'input', 'view_module', 'api', 'grading', 'query_builder', 'perm_media', 'copyright', 'build_circle', 'perm_contact_calendar', 'zoom_out', 'settings_phone', 'backup', 'open_with', 'circle_notifications', 'perm_phone_msg', 'label_important', 'speaker_notes', 'wysiwyg', 'card_membership', 'arrow_circle_down', 'book_online', 'file_present', 'pageview', 'percent', 'trending_down', 'upgrade', 'change_history', 'integration_instructions', '3d_rotation', 'accessible', 'class', 'swipe', 'g_translate', 'arrow_circle_left', 'settings_accessibility', 'offline_bolt', 'settings_backup_restore', 'expand', 'production_quantity_limits', 'view_column', 'aspect_ratio', 'model_training', 'donut_large', 'segment', 'alarm_on', 'schedule_send', 'calendar_view_month', 'maximize', 'settings_ethernet', 'thumbs_up_down', 'bookmark_add', 'theaters', 'view_agenda', 'thumb_down_off_alt', 'important_devices', 'unpublished', 'system_update_alt', 'opacity', 'shopping_cart_checkout', 'open_in_browser', 'commute', 'no_accounts', 'invert_colors', 'addchart', 'history_toggle_off', 'view_week', 'tour', 'youtube_searched_for', 'hide_source', 'search_off', 'filter_alt_off', 'not_started', 'bookmark_added', 'balance', 'shop', 'mark_as_unread', 'plagiarism', 'assignment_return', 'settings_input_antenna', 'flight_land', 'turned_in', 'hotel_class', 'assignment_late', 'donut_small', 'contactless', 'rocket', 'highlight_alt', 'saved_search', 'settings_input_component', 'view_carousel', 'view_quilt', 'all_inbox', 'settings_remote', 'anchor', 'hourglass_full', 'edit_off', 'mediation', 'terminal', 'fit_screen', 'turned_in_not', 'remove_shopping_cart', 'flaky', 'toll', 'lock_reset', 'swap_horizontal_circle', 'view_sidebar', 'lock_clock', 'vertical_split', 'settings_voice', 'data_exploration', 'online_prediction', 'event_seat', 'next_plan', 'restore_from_trash', 'pregnant_woman', 'camera_enhance', 'token', 'request_page', 'view_stream', 'dynamic_form', 'markunread_mailbox', 'tab', 'calendar_view_week', 'smart_button', 'remove_done', 'accessible_forward', 'settings_power', 'density_medium', 'add_card', 'add_to_drive', 'try', 'work_history', 'outbox', 'card_travel', 'offline_pin', 'fax', 'compress', 'find_replace', 'assured_workload', 'assignment_returned', '123', 'calendar_view_day', 'chrome_reader_mode', 'rowing', 'generating_tokens', 'outlet', 'http', 'free_cancellation', 'new_label', 'settings_brightness', 'backup_table', 'spellcheck', 'pan_tool_alt', 'restore_page', 'noise_control_off', 'event_repeat', 'alarm_add', 'credit_card_off', 'wifi_protected_setup', 'display_settings', 'play_for_work', 'disabled_visible', 'manage_history', 'view_timeline', 'settings_overscan', 'outbound', 'switch_access_shortcut', 'cancel_schedule_send', 'webhook', 'swap_vertical_circle', 'gif', 'satellite_alt', 'settings_input_composite', 'troubleshoot', 'quickreply', 'view_day', 'comment_bank', 'line_weight', 'horizontal_split', 'output', 'picture_in_picture', 'polymer', 'batch_prediction', 'send_and_archive', 'html', 'code_off', 'bookmark_remove', 'settings_bluetooth', 'shop_two', 'flip_to_front', 'gif_box', 'speaker_notes_off', 'eject', 'alarm_off', 'switch_access_shortcut_add', 'perm_data_setting', 'settings_input_hdmi', 'hourglass_disabled', 'perm_scan_wifi', 'sensors_off', 'work_off', 'join_full', 'picture_in_picture_alt', 'app_blocking', 'settings_cell', 'abc', 'javascript', 'lightbulb_circle', 'line_style', 'app_shortcut', 'perm_device_information', 'update_disabled', 'subtitles_off', 'arrow_outward', 'swipe_left', 'private_connectivity', 'voice_over_off', 'join_inner', 'install_desktop', 'swipe_right', 'settings_input_svideo', 'swipe_up', 'flip_to_back', 'view_array', 'open_in_new_off', 'density_small', 'all_out', 'shop_2', 'data_thresholding', 'lock_person', 'label_off', 'commit', 'tab_unselected', 'rounded_corner', 'view_kanban', 'text_rotate_vertical', 'install_mobile', 'spatial_audio_off', 'explore_off', 'css', 'swipe_down', 'text_rotation_none', 'join_left', 'not_accessible', 'noise_aware', 'pin_invoke', 'pinch', 'swipe_vertical', 'extension_off', 'perm_camera_mic', 'view_cozy', 'join_right', 'pin_end', 'swipe_right_alt', 'browse_gallery', 'php', 'view_comfy_alt', 'text_rotate_up', 'text_rotation_angledown', 'add_home', 'text_rotation_angleup', 'text_rotation_down', 'unfold_more_double', 'view_compact_alt', 'network_ping', 'swipe_down_alt', 'on_device_training', 'density_large', 'spatial_tracking', 'swipe_left_alt', 'spatial_audio', 'swipe_up_alt', 'unfold_less_double', 'repartition', 'width_full', 'transcribe', 'width_normal', 'width_wide', 'hls_off', 'hls', 'face_unlock', 'close', 'close', 'menu', 'expand_more', 'arrow_back', 'chevron_right', 'arrow_forward_ios', 'arrow_back_ios', 'cancel', 'arrow_drop_down', 'more_vert', 'arrow_forward', 'chevron_left', 'expand_less', 'check', 'more_horiz', 'refresh', 'apps', 'payments', 'arrow_upward', 'east', 'campaign', 'arrow_back_ios_new', 'arrow_downward', 'arrow_right', 'menu_open', 'fullscreen', 'arrow_drop_up', 'unfold_more', 'double_arrow', 'maps_home_work', 'west', 'expand_circle_down', 'arrow_left', 'south', 'north_east', 'north', 'first_page', 'home_work', 'fullscreen_exit', 'last_page', 'arrow_drop_down_circle', 'unfold_less', 'subdirectory_arrow_right', 'legend_toggle', 'south_east', 'app_settings_alt', 'subdirectory_arrow_left', 'assistant_direction', 'north_west', 'switch_left', 'waterfall_chart', 'south_west', 'pivot_table_chart', 'switch_right', 'apps_outage', 'offline_share', 'add_home_work', 'person', 'person', 'notifications', 'groups', 'people', 'share', 'school', 'person_outline', 'person_add', 'public', 'emoji_events', 'group', 'engineering', 'notifications_active', 'construction', 'people_alt', 'group_add', 'psychology', 'thumb_up_alt', 'health_and_safety', 'water_drop', 'travel_explore', 'notifications_none', 'emoji_emotions', 'sports_esports', 'workspace_premium', 'sentiment_very_satisfied', 'location_city', 'ios_share', 'precision_manufacturing', 'science', 'sentiment_satisfied', 'person_add_alt', 'military_tech', 'emoji_objects', 'history_edu', 'cake', 'handshake', 'sentiment_dissatisfied', 'sentiment_very_dissatisfied', 'emoji_people', 'self_improvement', 'person_remove', 'coronavirus', 'poll', 'whatshot', 'sports_soccer', 'domain', 'recommend', 'mood', 'people_outline', 'recycling', 'female', 'person_off', 'male', 'person_add_alt_1', 'sentiment_neutral', 'connect_without_contact', 'thumb_down_alt', 'waving_hand', 'real_estate_agent', 'back_hand', 'hiking', 'architecture', 'notifications_off', 'luggage', 'masks', 'front_hand', 'vaccines', 'mood_bad', 'compost', 'diversity_3', 'emoji_nature', 'switch_account', 'nights_stay', 'interests', 'king_bed', 'catching_pokemon', 'sports_basketball', 'notification_add', 'cruelty_free', 'man', 'sports_kabaddi', 'sports', 'emoji_food_beverage', 'reduce_capacity', 'sick', 'emoji_symbols', 'diversity_1', 'heart_broken', 'emoji_transportation', 'wallet', 'cookie', 'sports_tennis', 'add_reaction', 'personal_injury', 'woman', 'elderly', 'add_moderator', 'scale', 'transgender', 'outdoor_grill', 'deck', 'follow_the_signs', 'plus_one', 'social_distance', 'fireplace', 'pix', 'clean_hands', 'piano', 'psychology_alt', 'groups_2', 'sports_motorsports', 'surfing', 'sanitizer', 'hive', 'sports_handball', 'sports_baseball', 'edit_notifications', 'sports_volleyball', 'diversity_2', 'pages', 'sports_football', 'group_remove', 'downhill_skiing', 'kayaking', 'co2', 'public_off', 'single_bed', 'remove_moderator', 'boy', 'domain_add', 'notifications_paused', 'skateboarding', 'fitbit', 'person_remove_alt_1', 'safety_divider', 'thunderstorm', 'group_off', 'groups_3', 'sports_cricket', 'sports_martial_arts', 'sports_mma', 'sports_golf', 'girl', 'nordic_walking', 'face_6', 'sports_gymnastics', 'paragliding', 'face_3', 'party_mode', 'snowboarding', '6_ft_apart', 'kitesurfing', 'south_america', 'snowshoeing', 'sports_hockey', 'ice_skating', 'elderly_woman', 'person_2', 'sports_rugby', 'scoreboard', 'face_2', 'face_4', 'sledding', 'sign_language', 'cyclone', 'person_4', 'face_5', 'person_3', 'flood', 'no_luggage', 'scuba_diving', 'tsunami', 'severe_cold', 'piano_off', 'roller_skating', 'tornado', 'assist_walker', 'man_2', 'landslide', 'woman_2', 'blind', '18_up_rating', 'volcano', 'no_adult_content', 'man_4', 'man_3', 'add', 'add', 'add_circle_outline', 'content_copy', 'add_circle', 'send', 'clear', 'save', 'mail', 'link', 'remove', 'filter_list', 'inventory_2', 'inventory', 'insights', 'remove_circle_outline', 'bolt', 'sort', 'flag', 'reply', 'add_box', 'push_pin', 'remove_circle', 'block', 'calculate', 'create', 'undo', 'how_to_reg', 'content_paste', 'report', 'file_copy', 'backspace', 'shield', 'archive', 'save_alt', 'policy', 'change_circle', 'tag', 'redo', 'forward', 'content_cut', 'outlined_flag', 'inbox', 'link_off', 'ballot', 'drafts', 'biotech', 'report_gmailerrorred', 'delete_sweep', 'stacked_bar_chart', 'square_foot', 'markunread', 'add_link', 'stream', 'copy_all', 'dynamic_feed', 'move_to_inbox', 'where_to_vote', 'waves', 'content_paste_search', 'unarchive', 'reply_all', 'select_all', 'low_priority', 'save_as', 'text_format', 'font_download', 'weekend', 'how_to_vote', 'upcoming', 'gesture', 'attribution', 'flag_circle', 'content_paste_go', 'filter_list_off', 'next_week', 'content_paste_off', 'web_stories', 'report_off', 'deselect', 'font_download_off', 'edit', 'edit', 'navigate_next', 'photo_camera', 'image', 'tune', 'picture_as_pdf', 'receipt_long', 'circle', 'timer', 'auto_awesome', 'auto_stories', 'collections', 'navigate_before', 'add_a_photo', 'palette', 'remove_red_eye', 'music_note', 'add_photo_alternate', 'wb_sunny', 'brush', 'euro', 'flash_on', 'auto_fix_high', 'looks_one', 'control_point', 'style', 'adjust', 'straighten', 'photo_library', 'camera', 'portrait', 'camera_alt', 'audiotrack', 'color_lens', 'grid_on', 'rotate_right', 'timelapse', 'crop_free', 'currency_rupee', 'video_camera_front', 'landscape', 'slideshow', 'panorama_fish_eye', 'looks_two', 'crop_square', 'collections_bookmark', 'lens', 'looks_3', 'compare', 'filter_vintage', 'filter_drama', 'image_search', 'healing', 'rotate_left', 'center_focus_strong', 'assistant', 'auto_awesome_motion', 'blur_on', 'crop', 'face_retouching_natural', 'wb_incandescent', 'broken_image', 'flare', 'cases', 'wb_cloudy', 'filter_none', 'colorize', 'auto_fix_normal', 'crop_original', 'filter_center_focus', 'dehaze', 'brightness_4', 'nature_people', 'photo', 'flash_off', 'tag_faces', 'auto_awesome_mosaic', 'brightness_6', 'brightness_1', 'grain', 'brightness_5', 'details', 'flip_camera_android', 'flip', 'view_comfy', 'image_not_supported', 'loupe', 'bedtime', 'filter_1', 'flip_camera_ios', 'add_to_photos', 'looks_4', 'movie_creation', 'animation', 'center_focus_weak', 'panorama', 'movie_filter', 'crop_din', 'currency_bitcoin', 'currency_yen', 'control_point_duplicate', 'view_compact', 'leak_add', 'filter', 'brightness_7', 'incomplete_circle', 'nature', 'texture', 'contrast', 'timer_off', 'transform', 'photo_size_select_actual', 'video_camera_back', 'looks_5', 'motion_photos_on', 'rotate_90_degrees_ccw', 'photo_camera_front', 'mic_external_on', 'wb_twilight', 'currency_pound', 'gradient', 'assistant_photo', 'hide_image', 'exposure_plus_1', 'music_off', 'crop_16_9', 'exposure', 'filter_2', 'thermostat_auto', 'shutter_speed', 'photo_album', 'filter_tilt_shift', 'looks_6', 'looks', 'brightness_3', 'hdr_strong', 'linked_camera', 'vrpano', 'blur_circular', 'crop_portrait', 'flash_auto', 'photo_filter', 'motion_photos_auto', 'iso', 'brightness_2', 'crop_7_5', 'rotate_90_degrees_cw', 'photo_size_select_small', 'tonality', 'filter_hdr', 'currency_ruble', 'exposure_zero', 'crop_rotate', 'photo_size_select_large', 'filter_3', 'hdr_weak', 'camera_front', 'crop_5_4', 'burst_mode', 'filter_frames', 'logo_dev', 'camera_roll', 'blur_linear', 'filter_b_and_w', 'crop_landscape', 'crop_3_2', 'switch_camera', 'switch_video', 'filter_7', 'filter_4', 'filter_9_plus', 'exposure_plus_2', 'wb_iridescent', 'grid_off', 'photo_camera_back', 'motion_photos_paused', 'auto_fix_off', 'monochrome_photos', 'filter_5', 'exposure_neg_1', 'face_retouching_off', 'leak_remove', 'panorama_photosphere', 'filter_8', 'filter_9', 'timer_10', 'video_stable', 'filter_6', 'deblur', 'raw_on', 'wb_shade', 'blur_off', 'motion_photos_off', 'motion_photos_pause', 'vignette', 'hdr_on', 'panorama_horizontal', 'dirty_lens', 'image_aspect_ratio', '30fps_select', 'camera_rear', 'currency_yuan', 'currency_lira', 'timer_3', '60fps_select', 'panorama_wide_angle_select', '24mp', 'exposure_neg_2', 'autofps_select', 'panorama_horizontal_select', 'panorama_photosphere_select', 'panorama_wide_angle', 'wb_auto', 'hdr_plus', 'panorama_vertical_select', 'mic_external_off', 'currency_franc', '12mp', 'panorama_vertical', 'mp', 'hdr_enhanced_select', 'hevc', 'bedtime_off', '18mp', '10mp', '23mp', 'raw_off', 'hdr_off', '11mp', '20mp', '3mp', '5mp', '13mp', '15mp', '16mp', '21mp', '2mp', '17mp', '22mp', '14mp', '19mp', '7mp', '8mp', '4mp', '9mp', '6mp', 'email', 'email', 'location_on', 'call', 'phone', 'business', 'chat', 'mail_outline', 'list_alt', 'qr_code_scanner', 'vpn_key', 'chat_bubble_outline', 'alternate_email', 'forum', 'chat_bubble', 'textsms', 'person_search', 'contact_mail', 'sentiment_satisfied_alt', 'qr_code', 'qr_code_2', 'message', 'contacts', 'comment', 'key', 'import_contacts', 'app_registration', 'contact_phone', 'import_export', 'live_help', 'forward_to_inbox', 'hourglass_bottom', 'hourglass_top', 'rss_feed', 'mark_email_read', 'hub', 'read_more', 'document_scanner', 'more_time', 'mark_email_unread', 'call_end', 'clear_all', 'dialpad', 'phone_enabled', 'mark_chat_unread', 'cancel_presentation', '3p', 'call_made', 'screen_share', 'call_split', 'unsubscribe', 'co_present', 'domain_verification', 'present_to_all', 'mark_chat_read', 'add_ic_call', 'phonelink_ring', 'call_received', 'stay_current_portrait', 'phonelink_lock', 'cell_tower', 'phone_disabled', 'ring_volume', 'location_off', 'phonelink_setup', 'duo', 'swap_calls', 'stay_primary_portrait', 'voicemail', 'call_merge', 'phonelink_erase', 'mobile_screen_share', 'domain_disabled', 'person_add_disabled', 'contact_emergency', 'spoke', 'call_missed_outgoing', 'speaker_phone', 'desktop_access_disabled', 'mark_unread_chat_alt', 'cell_wifi', 'stop_screen_share', 'print_disabled', 'call_missed', 'pause_presentation', 'comments_disabled', 'dialer_sip', 'invert_colors_off', 'wifi_calling', 'rtt', 'portable_wifi_off', 'mail_lock', 'send_time_extension', 'stay_current_landscape', 'sip', 'nat', 'key_off', 'stay_primary_landscape', 'no_sim', 'vpn_key_off', 'local_shipping', 'local_shipping', 'place', 'menu_book', 'local_offer', 'badge', 'map', 'category', 'restaurant', 'directions_car', 'local_fire_department', 'volunteer_activism', 'my_location', 'flight', 'local_mall', 'near_me', 'handyman', 'directions_run', 'restaurant_menu', 'layers', 'medical_services', 'directions_walk', 'local_hospital', 'celebration', 'lunch_dining', 'local_library', 'pin_drop', 'park', 'local_atm', 'local_activity', 'directions_bus', 'design_services', 'person_pin', 'local_cafe', 'rate_review', 'delivery_dining', 'local_police', 'fastfood', 'directions_bike', 'directions_car_filled', 'home_repair_service', 'cleaning_services', 'zoom_out_map', 'hotel', 'local_grocery_store', 'local_phone', 'miscellaneous_services', 'diamond', 'navigation', 'local_gas_station', 'train', 'factory', 'local_parking', 'local_florist', 'person_pin_circle', 'money', 'local_post_office', 'two_wheeler', 'directions', 'route', 'add_business', 'electrical_services', 'warehouse', 'traffic', 'directions_boat', 'local_bar', 'alt_route', 'agriculture', 'beenhere', 'emergency', 'pedal_bike', '360', 'liquor', 'moving', 'local_airport', 'sailing', 'add_location_alt', 'local_dining', 'maps_ugc', 'local_taxi', 'local_laundry_service', 'trip_origin', 'directions_bus_filled', 'ramen_dining', 'local_drink', 'local_printshop', 'hail', 'theater_comedy', 'forest', 'local_pizza', 'not_listed_location', 'transfer_within_a_station', 'add_location', 'dinner_dining', 'bakery_dining', 'wine_bar', 'terrain', 'multiple_stop', 'takeout_dining', 'store_mall_directory', 'icecream', 'museum', 'nightlife', 'local_pharmacy', 'hardware', 'departure_board', 'set_meal', 'add_road', 'ev_station', 'electric_car', 'medical_information', 'local_see', 'festival', 'plumbing', 'car_rental', 'layers_clear', 'attractions', 'zoom_in_map', 'edit_location', 'pest_control', 'local_convenience_store', 'church', 'run_circle', 'dry_cleaning', 'edit_road', 'edit_attributes', 'edit_location_alt', 'car_repair', 'wrong_location', 'moped', 'local_movies', 'directions_boat_filled', 'signpost', 'satellite', 'soup_kitchen', 'tram', 'taxi_alert', 'crisis_alert', 'merge', 'breakfast_dining', 'straight', 'subway', 'atm', 'transit_enterexit', 'brunch_dining', 'connecting_airports', 'hvac', 'electric_bike', 'directions_transit', 'egg', 'safety_check', 'electric_scooter', 'stadium', 'bus_alert', 'mode_of_travel', 'local_hotel', 'local_car_wash', 'castle', 'car_crash', 'streetview', 'mosque', 'directions_subway', 'turn_right', 'compass_calibration', 'electric_rickshaw', 'airline_stops', 'fork_right', 'directions_railway', 'no_crash', 'no_meals', 'railway_alert', 'electric_moped', 'local_play', 'turn_left', 'u_turn_left', 'airlines', 'pest_control_rodent', 'egg_alt', 'tire_repair', 'bike_scooter', 'near_me_disabled', 'sos', 'snowmobile', 'minor_crash', 'directions_transit_filled', 'kebab_dining', 'no_transfer', 'flight_class', 'fort', 'fire_truck', 'temple_buddhist', 'directions_subway_filled', 'emergency_share', 'directions_railway_filled', 'u_turn_right', 'temple_hindu', 'fork_left', 'synagogue', 'screen_rotation_alt', 'remove_road', 'turn_sharp_right', 'roundabout_right', 'turn_slight_right', 'turn_slight_left', 'emergency_recording', 'roundabout_left', 'turn_sharp_left', 'ramp_left', 'ramp_right', 'fire_hydrant_alt', 'file_download', 'file_download', 'file_upload', 'download', 'folder', 'grid_view', 'upload_file', 'cloud_upload', 'folder_open', 'cloud', 'text_snippet', 'request_quote', 'cloud_download', 'drive_file_rename_outline', 'upload', 'attachment', 'newspaper', 'download_for_offline', 'create_new_folder', 'downloading', 'folder_shared', 'cloud_done', 'cloud_queue', 'workspaces', 'topic', 'approval', 'download_done', 'cloud_off', 'file_open', 'drive_file_move', 'drive_folder_upload', 'file_download_done', 'cloud_sync', 'attach_email', 'rule_folder', 'folder_zip', 'folder_copy', 'cloud_circle', 'difference', 'snippet_folder', 'file_download_off', 'folder_delete', 'drive_file_move_rtl', 'folder_off', 'format_overline', 'play_arrow', 'play_arrow', 'play_circle_filled', 'videocam', 'play_circle', 'mic', 'volume_up', 'pause', 'play_circle_outline', 'replay', 'library_books', 'volume_off', 'skip_next', 'fiber_manual_record', 'speed', 'stop', 'movie', 'skip_previous', 'new_releases', 'playlist_add', 'loop', 'equalizer', 'fast_forward', 'web', 'playlist_add_check', 'video_library', 'library_add', 'pause_circle', 'mic_off', 'stop_circle', 'subscriptions', 'repeat', 'volume_mute', 'video_call', 'not_interested', 'shuffle', 'sort_by_alpha', 'fast_rewind', 'mic_none', 'library_music', 'volume_down', 'videocam_off', 'recent_actors', 'web_asset', 'library_add_check', 'hearing', 'queue_music', 'pause_circle_filled', 'pause_circle_outline', 'fiber_new', 'subtitles', 'note', 'av_timer', 'album', 'playlist_play', 'queue', 'games', 'radio', 'replay_circle_filled', 'branding_watermark', 'forward_10', 'replay_10', 'closed_caption', 'video_settings', 'high_quality', 'featured_play_list', 'playlist_add_check_circle', 'control_camera', 'playlist_remove', 'slow_motion_video', 'add_to_queue', 'repeat_one', 'airplay', 'call_to_action', 'snooze', 'hd', 'replay_30', 'repeat_on', 'closed_caption_off', 'featured_video', 'audio_file', 'shuffle_on', 'interpreter_mode', 'forward_30', 'playlist_add_circle', '5g', 'music_video', 'queue_play_next', 'replay_5', 'video_file', 'art_track', 'hearing_disabled', 'forward_5', 'explicit', 'video_label', '4k', 'fiber_smart_record', 'repeat_one_on', 'surround_sound', 'closed_caption_disabled', 'remove_from_queue', 'play_disabled', 'web_asset_off', 'lyrics', 'sd', 'missed_video_call', '10k', 'fiber_pin', 'fiber_dvr', '4k_plus', '1k', '2k', '1k_plus', '8k', '5k', '8k_plus', '9k_plus', '3k', '5k_plus', '7k', '9k', '2k_plus', '3k_plus', '6k', '7k_plus', '6k_plus', 'star', 'star', 'check_box', 'check_box_outline_blank', 'radio_button_unchecked', 'radio_button_checked', 'star_border', 'toggle_on', 'star_outline', 'toggle_off', 'star_half', 'indeterminate_check_box', 'star_purple500', 'star_border_purple500', 'warning', 'warning', 'error', 'error_outline', 'warning_amber', 'notification_important', 'add_alert', 'auto_delete', 'support_agent', 'support_agent', 'wifi', 'account_tree', 'sync', 'priority_high', 'event_available', 'confirmation_number', 'event_note', 'sms', 'live_tv', 'ondemand_video', 'drive_eta', 'wifi_off', 'event_busy', 'do_not_disturb_on', 'wc', 'more', 'power', 'do_not_disturb', 'sync_problem', 'time_to_leave', 'do_disturb_on', 'vpn_lock', 'running_with_errors', 'folder_special', 'enhanced_encryption', 'do_disturb', 'sms_failed', 'network_check', 'phone_callback', 'adb', 'phone_forwarded', 'power_off', 'system_update', 'personal_video', 'voice_chat', 'airline_seat_recline_normal', 'vibration', 'do_disturb_alt', 'do_not_disturb_alt', 'sync_disabled', 'tap_and_play', 'no_encryption', 'sd_card', 'phone_missed', 'airline_seat_recline_extra', 'imagesearch_roller', 'mms', 'sync_lock', 'disc_full', 'no_encryption_gmailerrorred', 'bluetooth_audio', 'sd_card_alert', 'sim_card_alert', 'do_not_disturb_off', 'airline_seat_individual_suite', 'phone_paused', 'do_disturb_off', 'airline_seat_flat', 'phone_locked', 'network_locked', 'tv_off', 'phone_bluetooth_speaker', 'airline_seat_flat_angled', 'directions_off', 'airline_seat_legroom_normal', 'airline_seat_legroom_extra', 'airline_seat_legroom_reduced', 'video_chat', 'attach_money', 'attach_money', 'edit_note', 'format_list_bulleted', 'mode_edit', 'attach_file', 'monetization_on', 'post_add', 'bar_chart', 'checklist', 'drag_handle', 'show_chart', 'insert_drive_file', 'format_quote', 'query_stats', 'format_list_numbered', 'table_chart', 'border_color', 'pie_chart', 'notes', 'checklist_rtl', 'text_fields', 'format_bold', 'table_rows', 'publish', 'title', 'auto_graph', 'insert_emoticon', 'insert_photo', 'draw', 'insert_chart_outlined', 'mode', 'mode_comment', 'functions', 'insert_link', 'mode_edit_outline', 'horizontal_rule', 'insert_invitation', 'format_align_left', 'format_italic', 'format_color_fill', 'add_comment', 'insert_chart', 'linear_scale', 'stacked_line_chart', 'format_size', 'money_off', 'insert_comment', 'vertical_align_bottom', 'format_underlined', 'bubble_chart', 'height', 'schema', 'vertical_align_top', 'square', 'format_align_center', 'area_chart', 'format_paint', 'format_color_text', 'format_align_right', 'scatter_plot', 'format_list_numbered_rtl', 'data_object', 'highlight', 'format_align_justify', 'merge_type', 'add_chart', 'numbers', 'format_shapes', 'money_off_csred', 'pie_chart_outline', 'format_indent_increase', 'move_up', 'short_text', 'format_color_reset', 'strikethrough_s', 'vertical_align_center', 'hexagon', 'align_horizontal_left', 'rectangle', 'move_down', 'multiline_chart', 'polyline', 'score', 'border_all', 'text_increase', 'format_indent_decrease', 'format_clear', 'space_bar', 'format_line_spacing', 'candlestick_chart', 'horizontal_distribute', 'align_vertical_bottom', 'align_horizontal_center', 'vertical_distribute', 'align_horizontal_right', 'format_strikethrough', 'data_array', 'superscript', 'margin', 'pentagon', 'wrap_text', 'align_vertical_top', 'align_vertical_center', 'border_clear', 'text_decrease', 'subscript', 'border_style', 'padding', 'line_axis', 'border_outer', 'insert_page_break', 'shape_line', 'border_inner', 'border_left', 'border_bottom', 'format_textdirection_l_to_r', 'border_vertical', 'border_horizontal', 'format_textdirection_r_to_l', 'border_top', 'border_right', 'type_specimen', 'keyboard_arrow_down', 'keyboard_arrow_down', 'phone_iphone', 'smartphone', 'computer', 'keyboard_arrow_right', 'security', 'desktop_windows', 'smart_display', 'keyboard_backspace', 'phone_android', 'keyboard_arrow_up', 'keyboard_return', 'keyboard_double_arrow_right', 'laptop', 'smart_toy', 'keyboard_arrow_left', 'memory', 'headphones', 'point_of_sale', 'keyboard', 'headset_mic', 'tv', 'keyboard_double_arrow_left', 'keyboard_double_arrow_down', 'mouse', 'developer_board', 'keyboard_voice', 'start', 'router', 'videogame_asset', 'keyboard_double_arrow_up', 'cast_for_education', 'device_hub', 'headset', 'laptop_mac', 'cast', 'watch', 'tablet_mac', 'devices_other', 'desktop_mac', 'keyboard_tab', 'laptop_chromebook', 'phonelink', 'monitor', 'speaker', 'toys', 'gamepad', 'sim_card', 'keyboard_alt', 'connected_tv', 'tablet_android', 'cast_connected', 'laptop_windows', 'browser_updated', 'device_unknown', 'keyboard_hide', 'scanner', 'tablet', 'speaker_group', 'earbuds', 'keyboard_capslock', 'headset_off', 'keyboard_command_key', 'home_max', 'dock', 'headphones_battery', 'smart_screen', 'power_input', 'browser_not_supported', 'earbuds_battery', 'phonelink_off', 'home_mini', 'adf_scanner', 'developer_board_off', 'videogame_asset_off', 'keyboard_control_key', 'watch_off', 'keyboard_option_key', 'light_mode', 'light_mode', 'restart_alt', 'dark_mode', 'task', 'summarize', 'password', 'sell', 'signal_cellular_alt', 'devices', 'settings_suggest', 'quiz', 'widgets', 'storage', 'credit_score', 'thermostat', 'battery_full', 'gps_fixed', 'price_check', 'medication', 'pin', 'gpp_good', 'battery_charging_full', 'price_change', 'fmd_good', 'reviews', 'tungsten', 'air', 'note_alt', 'monitor_heart', 'bluetooth', 'graphic_eq', 'dvr', 'nightlight', 'access_time', 'sports_score', 'water', 'share_location', 'gpp_maybe', 'cable', 'location_searching', 'cameraswitch', 'discount', 'shortcut', 'airplane_ticket', 'radar', 'device_thermostat', 'wallpaper', 'gpp_bad', 'data_usage', 'monitor_weight', 'signal_wifi_4_bar', 'developer_mode', 'mode_night', 'wifi_tethering', 'bloodtype', 'battery_std', 'lan', 'signal_cellular_4_bar', 'fmd_bad', 'flashlight_on', 'splitscreen', 'network_wifi', 'access_time_filled', 'sim_card_download', 'airplanemode_active', 'mobile_friendly', 'usb', 'send_to_mobile', 'battery_alert', 'lens_blur', 'screen_search_desktop', 'signal_wifi_statusbar_4_bar', 'screen_rotation', 'signal_wifi_statusbar_connected_no_internet_4', 'gps_not_fixed', 'system_security_update_good', 'bluetooth_connected', 'battery_5_bar', 'nfc', 'remember_me', 'mode_standby', 'pattern', 'brightness_high', 'battery_saver', 'play_lesson', 'data_saver_off', 'storm', 'data_saver_on', 'brightness_medium', 'bluetooth_searching', 'signal_wifi_0_bar', 'grid_4x4', 'ssid_chart', 'brightness_low', 'ad_units', 'bluetooth_disabled', 'battery_4_bar', 'mobiledata_off', 'screenshot', 'network_cell', 'battery_0_bar', 'hdr_auto', 'wifi_calling_3', 'security_update_good', 'battery_unknown', 'battery_6_bar', 'signal_wifi_off', 'settings_system_daydream', 'battery_3_bar', 'access_alarms', 'signal_wifi_bad', 'access_alarm', 'signal_wifi_connected_no_internet_4', 'medication_liquid', 'aod', 'battery_1_bar', 'flashlight_off', 'signal_cellular_0_bar', 'add_to_home_screen', 'signal_wifi_statusbar_null', 'punch_clock', 'gps_off', 'security_update', 'sd_storage', 'grid_3x3', 'dataset', 'reset_tv', '4g_mobiledata', 'brightness_auto', 'battery_2_bar', 'signal_cellular_connected_no_internet_4_bar', 'screenshot_monitor', 'wifi_lock', 'do_not_disturb_on_total_silence', 'phishing', 'nearby_error', 'airplanemode_inactive', '1x_mobiledata', 'security_update_warning', 'signal_cellular_connected_no_internet_0_bar', 'screen_lock_portrait', 'wifi_password', 'system_security_update_warning', 'system_security_update', 'wifi_tethering_off', 'edgesensor_high', 'network_wifi_1_bar', 'signal_cellular_nodata', '30fps', 'wifi_find', 'add_alarm', 'signal_cellular_off', 'network_wifi_3_bar', '4g_plus_mobiledata', 'signal_wifi_4_bar_lock', 'lte_mobiledata', 'location_disabled', 'signal_cellular_null', 'mobile_off', 'bluetooth_drive', 'media_bluetooth_on', 'rsvp', 'edgesensor_low', 'grid_goldenratio', 'usb_off', 'dataset_linked', '3g_mobiledata', 'network_wifi_2_bar', 'screen_lock_rotation', 'screen_lock_landscape', '60fps', 'signal_cellular_alt_1_bar', 'lte_plus_mobiledata', 'wifi_2_bar', 'signal_cellular_alt_2_bar', 'timer_10_select', 'wifi_tethering_error', 'signal_cellular_no_sim', 'wifi_1_bar', 'wifi_channel', 'g_mobiledata', 'timer_3_select', 'h_mobiledata', 'media_bluetooth_off', 'e_mobiledata', 'r_mobiledata', 'h_plus_mobiledata', 'hdr_on_select', 'hdr_auto_select', 'devices_fold', 'nearby_off', 'hdr_off_select', 'fluorescent', 'macro_off', 'storefront', 'storefront', 'apartment', 'fitness_center', 'business_center', 'spa', 'meeting_room', 'house', 'corporate_fare', 'ac_unit', 'cottage', 'family_restroom', 'checkroom', 'other_houses', 'all_inclusive', 'grass', 'airport_shuttle', 'child_care', 'beach_access', 'pool', 'kitchen', 'casino', 'holiday_village', 'room_service', 'roofing', 'room_preferences', 'sports_bar', 'free_breakfast', 'escalator_warning', 'bathtub', 'child_friendly', 'foundation', 'food_bank', 'gite', 'villa', 'night_shelter', 'golf_course', 'no_photography', 'stairs', 'microwave', 'backpack', 'elevator', 'wash', 'smoking_rooms', 'cabin', 'house_siding', 'hot_tub', 'countertops', 'fire_extinguisher', 'water_damage', 'carpenter', 'rv_hookup', 'charging_station', 'baby_changing_station', 'soap', 'smoke_free', 'umbrella', 'do_not_touch', 'tapas', 'rice_bowl', 'fence', 'tty', 'balcony', 'no_food', 'houseboat', 'bento', 'wheelchair_pickup', 'iron', 'bungalow', 'crib', 'chalet', 'do_not_step', 'no_meeting_room', 'escalator', 'dry', 'stroller', 'no_drinks', 'no_cell', 'no_flash', 'no_backpack', 'no_stroller', 'vaping_rooms', 'desk', 'vape_free', 'manage_search', 'manage_search', 'feed', 'chair', 'bed', 'podcasts', 'coffee', 'shower', 'yard', 'window', 'light', 'door_front', 'garage', 'dining', 'flatware', 'coffee_maker', 'table_restaurant', 'blender', 'bedroom_parent', 'bedroom_baby', 'camera_indoor', 'bathroom', 'door_sliding', 'chair_alt', 'camera_outdoor', 'door_back', 'living', 'doorbell', 'table_bar', 'bedroom_child', 'sensor_door', 'sensor_door', 'electric_bolt', 'energy_savings_leaf', 'auto_mode', 'sensor_window', 'solar_power', 'shield_moon', 'oil_barrel', 'wind_power', 'sensor_occupied', 'electric_meter', 'heat_pump', 'gas_meter', 'propane_tank', 'mode_fan_off', 'roller_shades', 'broadcast_on_personal', 'propane', 'blinds', 'roller_shades_closed', 'blinds_closed', 'curtains', 'vertical_shades_closed', 'curtains_closed', 'broadcast_on_home', 'vertical_shades', 'nest_cam_wired_stand'];
  /* Linguas disponíveis
  Chinês Mandarim (zh-CN)
  Espanhol (es)
  Hindi (hi)
  Árabe (ar)
  Bengali (bn)
  Russo (ru)
  Japonês (ja)
  Alemão (de)
  Francês (fr)
  Coreano (ko)
  Vietnamita (vi)
  Italiano (it)
  Turco (tr)
  Polonês (pl)
  Holandês (nl)
  */
  const languages = {
    'pt-BR': {
      blocks: 'Blocos',
      expandAll: 'Expandir tudo',
      expand : 'Expandir',
      collect: 'Recolher tudo',
      toggle: 'Comutar bloco',
      settings: 'Configurações',
      configTitle: 'Configuração de Plugin',
      save: 'Salvar',
      resetPos: 'Resetar Valores',
      shortcuts: 'Atalho',
      icon: 'Ícone',
      autoSave: 'Auto-salvar',
      interval: 'Intervalo (seg)',
      close: 'Fechar',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Escolher Ícone',
      searchIcon: 'Buscar ícone...',
      about: 'Este script adiciona a possibilidade de salvar o status de blocos de códigos, expandidos ou retraidos (persistência de blocos), para projetos do Google App Script (GAS) utilizando o navegador Google Chrome em um Desktop com o plugin instalado. As informações são salvas no localStorage do navegador permitindo que voltem a seus estados ao serem reabertos na mesma maquina. Através da interface do Status Code Toolbar Pro é possível realizar configurações de teclas de atalhos para realizar ações e escolher os ícones da aplicação.'
    },
    'en': {
      blocks: 'Blocks',
      expandAll: 'Expand all',
      expand : 'Expand',
      collect: 'Fold all',
      toggle: 'Toggle block',
      settings: 'Settings',
      configTitle: 'Plugin Configuration',
      save: 'Save',
      resetPos: 'Reset Values',
      shortcuts: 'Shortcut',
      icon: 'Icon',
      autoSave: 'Auto-Save',
      interval: 'Interval (sec)',
      close: 'Close',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Choose Icon',
      searchIcon: 'Search icon...',
      about: 'This script adds the ability to save the status of code blocks, whether expanded or collapsed (block persistence), for Google App Script (GAS) projects using the Google Chrome browser on a desktop with the plugin installed. The information is saved in the browser\'s localStorage, allowing them to return to their original state when reopened on the same machine. Through the Status Code Toolbar Pro interface, you can configure shortcut keys to perform actions and select application icons.'
    },
    'zh-CN': {
      blocks: '块',
      expandAll: '全部展开',
      expand : '展开',
      collect: '全部折叠',
      toggle: '切换块',
      settings: '设置',
      configTitle: '插件配置',
      save: '保存',
      resetPos: '重置值',
      shortcuts: '快捷方式',
      icon: '图标',
      autoSave: '自动保存',
      interval: '间隔 (秒)',
      close: '关闭',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: '选择图标',
      searchIcon: '搜索图标...',
      about: '此脚本为使用安装了插件的桌面版Google Chrome浏览器上的Google App Script (GAS) 项目添加了保存代码块状态（展开或折叠，即块持久性）的功能。信息保存在浏览器的localStorage中，允许它们在同一台机器上重新打开时恢复到原始状态。通过Status Code Toolbar Pro界面，您可以配置快捷键以执行操作并选择应用程序图标。'
    },
    'es': {
      blocks: 'Bloques',
      expandAll: 'Expandir todo',
      expand : 'Expandir',
      collect: 'Contraer todo',
      toggle: 'Alternar bloque',
      settings: 'Configuración',
      configTitle: 'Configuración del Plugin',
      save: 'Guardar',
      resetPos: 'Restablecer Valores',
      shortcuts: 'Atajo',
      icon: 'Icono',
      autoSave: 'Guardado automático',
      interval: 'Intervalo (seg)',
      close: 'Cerrar',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Elegir icono',
      searchIcon: 'Buscar icono...',
      about: 'Este script añade la capacidad de guardar el estado de los bloques de código, ya sean expandidos o contraídos (persistencia de bloques), para proyectos de Google App Script (GAS) utilizando el navegador Google Chrome en un escritorio con el plugin instalado. La información se guarda en el localStorage del navegador, permitiendo que vuelvan a su estado original al reabrirse en la misma máquina. A través de la interfaz de Status Code Toolbar Pro, puede configurar teclas de acceso directo para realizar acciones y seleccionar los iconos de la aplicación.'
    },
    'hi': {
      blocks: 'ब्लॉक',
      expandAll: 'सभी का विस्तार करें',
      expand : 'विस्तार करें',
      collect: 'सभी को मोड़ें',
      toggle: 'ब्लॉक टॉगल करें',
      settings: 'सेटिंग्स',
      configTitle: 'प्लगइन कॉन्फ़िगरेशन',
      save: 'सहेजें',
      resetPos: 'मान रीसेट करें',
      shortcuts: 'शॉर्टकट',
      icon: 'आइकन',
      autoSave: 'स्वतः सहेजें',
      interval: 'अंतराल (सेकंड)',
      close: 'बंद करें',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'आइकन चुनें',
      searchIcon: 'आइकन खोजें...',
      about: 'यह स्क्रिप्ट Google Chrome ब्राउज़र का उपयोग करके डेस्कटॉप पर स्थापित प्लगइन के साथ Google App Script (GAS) परियोजनाओं के लिए कोड ब्लॉक की स्थिति, चाहे विस्तारित हो या संक्षिप्त (ब्लॉक दृढ़ता) को सहेजने की क्षमता जोड़ती है। जानकारी ब्राउज़र के localStorage में सहेजी जाती है, जिससे वे उसी मशीन पर फिर से खोलने पर अपनी मूल स्थिति में वापस आ सकें। Status Code Toolbar Pro इंटरफ़ेस के माध्यम से, आप क्रियाएँ करने के लिए शॉर्टकट कुंजी कॉन्फ़िगर कर सकते हैं और एप्लिकेशन आइकन का चयन कर सकते हैं।'
    },
    'ar': {
      blocks: 'الكتل',
      expandAll: 'توسيع الكل',
      expand : 'توسيع',
      collect: 'طي الكل',
      toggle: 'تبديل الكتلة',
      settings: 'الإعدادات',
      configTitle: 'تهيئة المكون الإضافي',
      save: 'حفظ',
      resetPos: 'إعادة تعيين القيم',
      shortcuts: 'اختصار',
      icon: 'أيقونة',
      autoSave: 'حفظ تلقائي',
      interval: 'الفاصل الزمني (ثانية)',
      close: 'إغلاق',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'اختر أيقونة',
      searchIcon: 'بحث عن أيقونة...',
      about: 'يضيف هذا السكربت القدرة على حفظ حالة كتل التعليمات البرمجية، سواء كانت موسعة أو مطوية (استمرارية الكتل)، لمشاريع Google App Script (GAS) باستخدام متصفح Google Chrome على سطح المكتب مع تثبيت المكون الإضافي. يتم حفظ المعلومات في localStorage الخاص بالمتصفح، مما يسمح لها بالعودة إلى حالتها الأصلية عند إعادة فتحها على نفس الجهاز. من خلال واجهة Status Code Toolbar Pro، يمكنك تكوين مفاتيح الاختصار لتنفيذ الإجراءات وتحديد أيقونات التطبيق.'
    },
    'bn': {
      blocks: 'ব্লক',
      expandAll: 'সব প্রসারিত করুন',
      expand : 'প্রসারিত করুন',
      collect: 'সব ভাঁজ করুন',
      toggle: 'ব্লক টগল করুন',
      settings: 'সেটিংস',
      configTitle: 'প্লাগইন কনফিগারেশন',
      save: 'সংরক্ষণ করুন',
      resetPos: 'মান রিসেট করুন',
      shortcuts: 'শর্টকাট',
      icon: 'আইকন',
      autoSave: 'স্বয়ংক্রিয় সংরক্ষণ',
      interval: 'বিরতি (সেকেন্ড)',
      close: 'বন্ধ করুন',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'আইকন নির্বাচন করুন',
      searchIcon: 'আইকন অনুসন্ধান করুন...',
      about: 'এই স্ক্রিপ্ট গুগল ক্রোম ব্রাউজার ব্যবহার করে ডেস্কটপে ইনস্টল করা প্লাগইন সহ গুগল অ্যাপ স্ক্রিপ্ট (GAS) প্রকল্পগুলির জন্য কোড ব্লকগুলির অবস্থা, প্রসারিত বা সঙ্কুচিত (ব্লক স্থায়ীত্ব) সংরক্ষণ করার ক্ষমতা যোগ করে। তথ্য ব্রাউজারের localStorage-এ সংরক্ষিত হয়, যা একই মেশিনে পুনরায় খুললে সেগুলিকে তাদের মূল অবস্থায় ফিরে আসার অনুমতি দেয়। স্ট্যাটাস কোড টুলবার প্রো ইন্টারফেসের মাধ্যমে, আপনি ক্রিয়া সম্পাদন করার জন্য শর্টকাট কীগুলি কনফিগার করতে এবং অ্যাপ্লিকেশন আইকন নির্বাচন করতে পারেন।'
    },
    'ru': {
      blocks: 'Блоки',
      expandAll: 'Развернуть все',
      expand : 'Развернуть',
      collect: 'Свернуть все',
      toggle: 'Переключить блок',
      settings: 'Настройки',
      configTitle: 'Конфигурация плагина',
      save: 'Сохранить',
      resetPos: 'Сбросить значения',
      shortcuts: 'Ярлык',
      icon: 'Значок',
      autoSave: 'Автосохранение',
      interval: 'Интервал (сек)',
      close: 'Закрыть',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Выбрать значок',
      searchIcon: 'Поиск значка...',
      about: 'Этот скрипт добавляет возможность сохранять состояние блоков кода, будь то развернутые или свернутые (сохранение блоков), для проектов Google App Script (GAS) с использованием браузера Google Chrome на настольном компьютере с установленным плагином. Информация сохраняется в localStorage браузера, позволяя им возвращаться в исходное состояние при повторном открытии на той же машине. Через интерфейс Status Code Toolbar Pro вы можете настраивать сочетания клавиш для выполнения действий и выбирать значки приложения.'
    },
    'ja': {
      blocks: 'ブロック',
      expandAll: 'すべて展開',
      expand : '展開',
      collect: 'すべて折りたたむ',
      toggle: 'ブロック切り替え',
      settings: '設定',
      configTitle: 'プラグイン設定',
      save: '保存',
      resetPos: '値をリセット',
      shortcuts: 'ショートカット',
      icon: 'アイコン',
      autoSave: '自動保存',
      interval: '間隔 (秒)',
      close: '閉じる',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'アイコンを選択',
      searchIcon: 'アイコンを検索...',
      about: 'このスクリプトは、Google Chromeブラウザとプラグインがインストールされたデスクトップ上で、Google App Script (GAS) プロジェクトのコードブロックの状態（展開または折りたたみ、つまりブロックの永続性）を保存する機能を追加します。情報はブラウザのlocalStorageに保存され、同じマシンで再度開いたときに元の状態に戻ることができます。Status Code Toolbar Proインターフェースを通じて、アクションを実行するためのショートカットキーを設定したり、アプリケーションのアイコンを選択したりできます。'
    },
    'de': {
      blocks: 'Blöcke',
      expandAll: 'Alle erweitern',
      expand : 'Erweitern',
      collect: 'Alle einklappen',
      toggle: 'Block umschalten',
      settings: 'Einstellungen',
      configTitle: 'Plugin-Konfiguration',
      save: 'Speichern',
      resetPos: 'Werte zurücksetzen',
      shortcuts: 'Verknüpfung',
      icon: 'Symbol',
      autoSave: 'Auto-Speichern',
      interval: 'Intervall (Sek)',
      close: 'Schließen',
      combo: '(Strg + Alt + ) ',
      chooseIcon: 'Symbol auswählen',
      searchIcon: 'Symbol suchen...',
      about: 'Dieses Skript fügt die Möglichkeit hinzu, den Status von Codeblöcken, ob erweitert oder minimiert (Blockpersistenz), für Google App Script (GAS)-Projekte mit dem Google Chrome-Browser auf einem Desktop mit installiertem Plugin zu speichern. Die Informationen werden im localStorage des Browsers gespeichert, sodass sie beim erneuten Öffnen auf derselben Maschine in ihren ursprünglichen Zustand zurückkehren können. Über die Status Code Toolbar Pro-Oberfläche können Sie Tastenkombinationen für Aktionen konfigurieren und Anwendungssymbole auswählen.'
    },
    'fr': {
      blocks: 'Blocs',
      expandAll: 'Tout développer',
      expand : 'Développer',
      collect: 'Tout réduire',
      toggle: 'Basculer le bloc',
      settings: 'Paramètres',
      configTitle: 'Configuration du plugin',
      save: 'Enregistrer',
      resetPos: 'Réinitialiser les valeurs',
      shortcuts: 'Raccourci',
      icon: 'Icône',
      autoSave: 'Sauvegarde auto',
      interval: 'Intervalle (sec)',
      close: 'Fermer',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Choisir l\'icône',
      searchIcon: 'Rechercher une icône...',
      about: 'Ce script ajoute la possibilité de sauvegarder l\'état des blocs de code, qu\'ils soient développés ou réduits (persistance des blocs), pour les projets Google App Script (GAS) en utilisant le navigateur Google Chrome sur un ordinateur de bureau avec le plugin installé. Les informations sont sauvegardées dans le localStorage du navigateur, leur permettant de retrouver leur état d\'origine lors de leur réouverture sur la même machine. Via l\'interface Status Code Toolbar Pro, vous pouvez configurer des touches de raccourci pour effectuer des actions et sélectionner les icônes de l\'application.'
    },
    'ko': {
      blocks: '블록',
      expandAll: '모두 확장',
      expand : '확장',
      collect: '모두 접기',
      toggle: '블록 전환',
      settings: '설정',
      configTitle: '플러그인 구성',
      save: '저장',
      resetPos: '값 초기화',
      shortcuts: '단축키',
      icon: '아이콘',
      autoSave: '자동 저장',
      interval: '간격 (초)',
      close: '닫기',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: '아이콘 선택',
      searchIcon: '아이콘 검색...',
      about: '이 스크립트는 플러그인이 설치된 데스크톱에서 Google Chrome 브라우저를 사용하여 Google App Script (GAS) 프로젝트의 코드 블록 상태(확장 또는 축소, 즉 블록 지속성)를 저장하는 기능을 추가합니다. 정보는 브라우저의 localStorage에 저장되어 동일한 기기에서 다시 열 때 원래 상태로 돌아갈 수 있습니다. Status Code Toolbar Pro 인터페이스를 통해 작업을 수행하는 단축키를 구성하고 애플리케이션 아이콘을 선택할 수 있습니다.'
    },
    'vi': {
      blocks: 'Khối',
      expandAll: 'Mở rộng tất cả',
      expand : 'Mở rộng',
      collect: 'Thu gọn tất cả',
      toggle: 'Chuyển đổi khối',
      settings: 'Cài đặt',
      configTitle: 'Cấu hình Plugin',
      save: 'Lưu',
      resetPos: 'Đặt lại giá trị',
      shortcuts: 'Phím tắt',
      icon: 'Biểu tượng',
      autoSave: 'Tự động lưu',
      interval: 'Khoảng thời gian (giây)',
      close: 'Đóng',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Chọn biểu tượng',
      searchIcon: 'Tìm kiếm biểu tượng...',
      about: 'Script này thêm khả năng lưu trạng thái của các khối mã, dù đã mở rộng hay thu gọn (duy trì khối), cho các dự án Google App Script (GAS) bằng cách sử dụng trình duyệt Google Chrome trên máy tính để bàn có cài đặt plugin. Thông tin được lưu trong localStorage của trình duyệt, cho phép chúng trở lại trạng thái ban đầu khi được mở lại trên cùng một máy. Thông qua giao diện Status Code Toolbar Pro, bạn có thể cấu hình các phím tắt để thực hiện các hành động và chọn biểu tượng ứng dụng.'
    },
    'it': {
      blocks: 'Blocchi',
      expandAll: 'Espandi tutto',
      expand : 'Espandi',
      collect: 'Comprimi tutto',
      toggle: 'Attiva/disattiva blocco',
      settings: 'Impostazioni',
      configTitle: 'Configurazione Plugin',
      save: 'Salva',
      resetPos: 'Reimposta valori',
      shortcuts: 'Scorciatoia',
      icon: 'Icona',
      autoSave: 'Salvataggio automatico',
      interval: 'Intervallo (sec)',
      close: 'Chiudi',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Scegli icona',
      searchIcon: 'Cerca icona...',
      about: 'Questo script aggiunge la possibilità di salvare lo stato dei blocchi di codice, espansi o compressi (persistenza dei blocchi), per i progetti Google App Script (GAS) utilizzando il browser Google Chrome su un desktop con il plugin installato. Le informazioni vengono salvate nel localStorage del browser, consentendo loro di tornare allo stato originale quando riaperti sulla stessa macchina. Tramite l\'interfaccia di Status Code Toolbar Pro è possibile configurare i tasti di scelta rapida per eseguire azioni e selezionare le icone dell\'applicazione.'
    },
    'tr': {
      blocks: 'Bloklar',
      expandAll: 'Tümünü genişlet',
      expand : 'Genişlet',
      collect: 'Tümünü daralt',
      toggle: 'Bloğu değiştir',
      settings: 'Ayarlar',
      configTitle: 'Eklenti Yapılandırması',
      save: 'Kaydet',
      resetPos: 'Değerleri Sıfırla',
      shortcuts: 'Kısayol',
      icon: 'Simge',
      autoSave: 'Otomatik Kaydetme',
      interval: 'Aralık (sn)',
      close: 'Kapat',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Simge Seç',
      searchIcon: 'Simge ara...',
      about: 'Bu betik, yüklü eklentiye sahip bir masaüstü bilgisayarda Google Chrome tarayıcısını kullanarak Google App Script (GAS) projeleri için kod bloklarının durumunu (genişletilmiş veya daraltılmış, yani blok kalıcılığı) kaydetme yeteneği ekler. Bilgiler tarayıcının localStorage\'ında saklanır ve aynı makinede yeniden açıldığında orijinal durumlarına dönmelerini sağlar. Status Code Toolbar Pro arayüzü aracılığıyla, eylemleri gerçekleştirmek için kısayol tuşlarını yapılandırabilir ve uygulama simgelerini seçebilirsiniz.'
    },
    'pl': {
      blocks: 'Bloki',
      expandAll: 'Rozwiń wszystko',
      expand : 'Rozwiń',
      collect: 'Zwiń wszystko',
      toggle: 'Przełącz blok',
      settings: 'Ustawienia',
      configTitle: 'Konfiguracja wtyczki',
      save: 'Zapisz',
      resetPos: 'Resetuj wartości',
      shortcuts: 'Skrót',
      icon: 'Ikona',
      autoSave: 'Autozapis',
      interval: 'Interwał (sek)',
      close: 'Zamknij',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Wybierz ikonę',
      searchIcon: 'Szukaj ikony...',
      about: 'Ten skrypt dodaje możliwość zapisywania stanu bloków kodu, rozszerzonych lub zwiniętych (trwałość bloków), dla projektów Google App Script (GAS) przy użyciu przeglądarki Google Chrome na komputerze stacjonarnym z zainstalowaną wtyczką. Informacje są zapisywane w localStorage przeglądarki, co pozwala im wrócić do pierwotnego stanu po ponownym otwarciu na tej samej maszynie. Za pośrednictwem interfejsu Status Code Toolbar Pro można skonfigurować klawisze skrótów do wykonywania akcji i wybierać ikony aplikacji.'
    },
    'nl': {
      blocks: 'Blokken',
      expandAll: 'Alles uitvouwen',
      expand : 'Uitvouwen',
      collect: 'Alles invouwen',
      toggle: 'Blok wisselen',
      settings: 'Instellingen',
      configTitle: 'Plugin Configuratie',
      save: 'Opslaan',
      resetPos: 'Waarden resetten',
      shortcuts: 'Snelkoppeling',
      icon: 'Icoon',
      autoSave: 'Automatisch opslaan',
      interval: 'Interval (sec)',
      close: 'Sluiten',
      combo: '(Ctrl + Alt + ) ',
      chooseIcon: 'Icoon kiezen',
      searchIcon: 'Icoon zoeken...',
      about: 'Dit script voegt de mogelijkheid toe om de status van codeblokken, of deze nu zijn uitgevouwen of samengevouwen (blokpersistentie), op te slaan voor Google App Script (GAS)-projecten met behulp van de Google Chrome-browser op een desktop met de geïnstalleerde plugin. De informatie wordt opgeslagen in de localStorage van de browser, waardoor ze hun oorspronkelijke staat kunnen herstellen wanneer ze opnieuw worden geopend op dezelfde machine. Via de Status Code Toolbar Pro-interface kunt u sneltoetsen configureren om acties uit te voeren en applicatiepictogrammen te selecteren.'
    }
  };
  const langCode = languages[navigator.language] ? navigator.language : 'en';
  const T = languages[langCode];

  const STORAGE_KEY = 'gasFoldStates';
  const POS_KEY = 'folderToolbarPosition';

  if (!location.pathname.endsWith('/edit')) return;

  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  waitForMonacoEditor((monaco, editor) => {
    monitorFoldChanges(editor);
    restoreFoldState(editor);
    addToolbar(editor, monaco);
    addShortcuts(editor, monaco);
    setupPersistence(editor);
    persistFoldState(editor);
    startAutoSave();
  });

  function waitForMonacoEditor(callback) {
    const interval = setInterval(() => {
      const monaco = window.monaco;
      const editors = monaco?.editor?.getEditors?.();
      if (editors && editors.length > 0) {
        clearInterval(interval);
        callback(monaco, editors[0]);
      }
    }, 500);
  }

  function getFileName() {
    const tab = document.querySelector('.editor-tab-label[aria-selected="true"]');
    return tab?.textContent.trim() ?? 'unknown';
  }

  function getProjectId() {
    const match = location.href.match(/\/projects\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : 'unknown_project';
  }

  function getStorageKey(fileName) {
    return `${STORAGE_KEY}:${getProjectId()}:${fileName}`;
  }

  function saveFoldState(editor) {
    const model = editor.getModel();
    const viewState = editor.saveViewState();
    if (model && viewState) {
      const key = getStorageKey(model.uri.path);
      localStorage.setItem(key, JSON.stringify(viewState));
      //console.log('[GAS Toolbar] Estado salvo:', key);
    }
  }

  function restoreFoldState(editor) {
    const model = editor.getModel();
    const key = getStorageKey(model.uri.path);
    const state = localStorage.getItem(key);
    if (state) {
      try {
        const viewState = JSON.parse(state);
        editor.restoreViewState(viewState);
        editor.revealPositionInCenter(viewState.cursorState?.[0]?.position || { lineNumber: 1, column: 1 });
        //console.log('[GAS Toolbar] Estado restaurado:', key);
      } catch (e) {
        //console.warn('[GAS Toolbar] Falha ao restaurar estado:', e);
      }
    }
  }

  function setupPersistence(editor) {
    restoreFoldState(editor);

    // Detecta qualquer mudança de dobra
    let lastHidden = JSON.stringify(editor._hiddenAreas || []);
    setInterval(() => {
      const current = JSON.stringify(editor._hiddenAreas || []);
      if (current !== lastHidden) {
        lastHidden = current;
        saveFoldState(editor);
      }
    }, 1000);

    editor.onDidChangeModel(() => {
      restoreFoldState(editor);
    });
  }

  function monitorFoldChanges(editor) {
    let lastState = '';
    setInterval(() => {
      const state = JSON.stringify(editor.saveViewState());
      if (state !== lastState) {
        saveFoldState(editor);
        lastState = state;
      }
    }, 1000);
  }

  function addToolbar(editor, monaco) {
    const config = JSON.parse(localStorage.getItem('foldToolbarConfig')) || {
      shortcuts: { expand: 'a', fold: 'f', toggle: 'o' },
      icons: { expand: 'unfold_more', fold: 'unfold_less', toggle: 'code' },
      autoSave: false,
      interval: 60
    };

    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
      position: fixed; z-index: 9999; display: flex; flex-direction: row; align-items: center;
      background: #fff; border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      padding: 3px 5px; gap: 10px; cursor: move; user-select: none; font-family: Roboto, Arial, sans-serif;
    `;
    const savedPos = JSON.parse(localStorage.getItem('foldToolbarPosition'));
    toolbar.style.top = savedPos?.top || '10px';
    toolbar.style.left = savedPos?.left || '770px';

    const icMove = document.createElement('div');
    icMove.textContent = '::';
    icMove.style.fontWeight = '500';
    icMove.style.fontSize = '14px';

    const title = document.createElement('span');
    title.textContent = T.blocks;
    title.style.fontWeight = '500';
    title.style.fontSize = '14px';
    title.style.marginRight = '10px';

    const btnExpand = createSafeIconButton(config.icons.expand, '#4CAF50', () => { unfoldAll(editor, monaco); }, T.expandAll);
    const btnFold = createSafeIconButton(config.icons.fold, '#f44336', () => { foldAll(editor, monaco); }, T.collect);
    const btnToggle = createSafeIconButton(config.icons.toggle, '#1a73e8', () => { toggleCurrentBlock(editor, monaco); }, T.toggle);
    const btnSettings = createSafeIconButton('settings', '#555', () => toggleSidebar(), T.settings);

    toolbar.append(icMove, title, btnExpand, btnFold, btnToggle, btnSettings);
    document.body.appendChild(toolbar);
    makeDraggable(toolbar);

    const sidebar = document.createElement('div');
    sidebar.style.cssText = `
      position: fixed; top: 0; right: 0; width: 350px; height: 100%;
      background: #fff; border-left: 1px solid #dadce0;
      box-shadow: -2px 0 6px rgba(0,0,0,0.1);
      padding: 30px 20px; display: none; flex-direction: column;
      font-family: Roboto, Arial, sans-serif; z-index: 9999;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.title = T.close;
    closeBtn.style.cssText = `
      position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;
    `;
    const closeIcon = document.createElement('span');
    closeIcon.className = 'material-icons';
    closeIcon.textContent = 'close';
    closeBtn.appendChild(closeIcon);
    closeBtn.onclick = () => sidebar.style.display = 'none';
    sidebar.appendChild(closeBtn);

    const stitle = document.createElement('h1');
    stitle.textContent = 'GAS Status Code Toolbar';
    //stitle.style.borderColor = 'rgb(218,220,224)';
    //stitle.style.border = '1px rgb(218,220,224) solid';
    stitle.style.borderBottom = '1px rgb(218,220,224) solid';
    stitle.style.textAlign = 'center';
    sidebar.appendChild(stitle);

    const configTitle = document.createElement('h2');
    configTitle.textContent = T.configTitle;
    configTitle.style.margin = '0 0 20px 0';
    configTitle.style.textAlign = 'center';
    sidebar.appendChild(configTitle);

    sidebar.appendChild(createInputWithIconPicker(`${T.combo} ${T.shortcuts} ${T.expand}`, 'shortcutExpand', config.shortcuts.expand, 'expandIcon', config.icons.expand));
    sidebar.appendChild(createInputWithIconPicker(`${T.combo} ${T.shortcuts} ${T.collect}`, 'shortcutFold', config.shortcuts.fold, 'foldIcon', config.icons.fold));
    sidebar.appendChild(createInputWithIconPicker(`${T.combo} ${T.shortcuts} ${T.toggle}`, 'shortcutToggle', config.shortcuts.toggle, 'toggleIcon', config.icons.toggle));

    sidebar.appendChild(createMaterialCheckbox(`${T.autoSave}`, 'autoSaveCheck', config.autoSave));
    sidebar.appendChild(createMaterialInput(`${T.interval}`, 'autoSaveInterval', config.interval, 'number'));

    const saveBtn = document.createElement('button');
    saveBtn.textContent = T.save;
    saveBtn.style.cssText = `
      margin-top: 20px; background: #1a73e8; color: #fff; border: none; border-radius: 4px;
      padding: 8px 16px; font-weight: 500; cursor: pointer;
    `;
    saveBtn.onclick = () => {
      config.shortcuts.expand = document.getElementById('shortcutExpand').value;
      config.shortcuts.fold = document.getElementById('shortcutFold').value;
      config.shortcuts.toggle = document.getElementById('shortcutToggle').value;
      config.icons.expand = document.getElementById('expandIcon').dataset.icon;
      config.icons.fold = document.getElementById('foldIcon').dataset.icon;
      config.icons.toggle = document.getElementById('toggleIcon').dataset.icon;
      config.autoSave = document.getElementById('autoSaveCheck').checked;
      config.interval = parseInt(document.getElementById('autoSaveInterval').value) || 60;
      localStorage.setItem('foldToolbarConfig', JSON.stringify(config));
      location.reload();
    };
    sidebar.appendChild(saveBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = T.resetPos;
    resetBtn.style.cssText = `
      margin-top: 10px; background: #dadce0; border: none; border-radius: 4px;
      padding: 6px 12px; font-weight: 500; cursor: pointer;
    `;
    resetBtn.onclick = () => {
      localStorage.removeItem('foldToolbarPosition');
      location.reload();
    };
    sidebar.appendChild(resetBtn);

    // 🔥 COPYRIGHT seguro com POPOVER avançado (links e texto)
    const copyright = document.createElement('div');
    copyright.style.cssText = `
      top: -500px; right: 12px; font-size: 12px; color: #999; cursor: pointer;
      display: flex; align-items: center; gap: 4px; position: relative;
    `;

    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.textContent = 'copyright';
    icon.style.fontSize = '16px';

    const label = document.createElement('span');
    label.textContent = 'by Bitts';

    // Popover container com conteúdo rico
    const popover = document.createElement('div');
    popover.style.cssText = `
      position: absolute; top: 15px; right: 100%;
      background: #333; color: #fff; padding: 10px 14px; border-radius: 4px; font-size: 12px;
      white-space: normal; display: none; z-index: 10000; width: 220px;
    `;

    // Texto informativo
    const info = document.createElement('p');
    info.textContent = T.about;

    // Link 1
    const link1 = document.createElement('a');
    link1.href = 'https://github.com/bitts';
    link1.target = '_blank';
    link1.rel = 'noopener noreferrer';
    link1.textContent = 'GitHub';
    link1.style.cssText = 'color: #4FC3F7; display: block; margin-top: 8px; text-decoration: underline;';

    // Link 2
    const link2 = document.createElement('a');
    link2.href = 'https://mbitts.com';
    link2.target = '_blank';
    link2.rel = 'noopener noreferrer';
    link2.textContent = 'mbitts.com';
    link2.style.cssText = 'color: #4FC3F7; display: block; text-decoration: underline;';

    // Fechar popover ao clicar fora
    document.addEventListener('click', (e) => {
      if (!copyright.contains(e.target)) {
        popover.style.display = 'none';
      }
    });

    popover.appendChild(info);
    popover.appendChild(link1);
    popover.appendChild(link2);

    // Mostrar popover no clique
    copyright.onclick = (e) => {
      e.stopPropagation();
      popover.style.display = popover.style.display === 'block' ? 'none' : 'block';
    };

    copyright.appendChild(icon);
    copyright.appendChild(label);
    copyright.appendChild(popover);

    sidebar.appendChild(copyright);

    document.body.appendChild(sidebar);

    function toggleSidebar() {
      sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
    }
  }

  function createSafeIconButton(icon, color, action, tooltip) {
    const btn = document.createElement('button');
    const span = document.createElement('span');
    span.className = 'material-icons';
    span.textContent = icon;
    btn.appendChild(span);
    btn.title = tooltip;
    btn.style = `background:${color}; border:none; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff;`;
    btn.onclick = action;
    return btn;
  }

  function createInputWithIconPicker(labelText, inputId, inputValue, iconBtnId, currentIcon) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-bottom: 20px; text-align: center;';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.cssText = 'font-size: 12px; color: #5f6368; display: block; margin-bottom: 4px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = inputId;
    input.value = inputValue;
    input.style.cssText = `
      width: 60%; padding: 8px; border: 1px solid #dadce0; border-radius: 4px;
      font-size: 14px; box-sizing: border-box; text-align: center; transition: border 0.3s;
    `;

    const iconBtn = document.createElement('button');
    iconBtn.id = iconBtnId;
    iconBtn.dataset.icon = currentIcon;
    iconBtn.title = T.chooseIcon;
    iconBtn.style.cssText = `
      background: #dadce0; border: none; border-radius: 4px; margin-left: 8px;
      cursor: pointer; padding: 6px 10px;
    `;
    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-icons';
    iconSpan.textContent = currentIcon;
    iconBtn.appendChild(iconSpan);

    iconBtn.onclick = (e) => {
      e.preventDefault();
      showIconPicker(iconBtn, iconSpan);
    };

    wrapper.append(label, input, iconBtn);
    return wrapper;
  }

  function showIconPicker(targetBtn, iconSpan) {
    const existing = document.getElementById('iconPicker');
    if (existing) existing.remove();

    let page = 0;
    let filtered = allIcons.slice();

    const picker = document.createElement('div');
    picker.id = 'iconPicker';
    picker.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 420px; height: 400px; background: #fff; border: 1px solid #dadce0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; z-index: 99999;
      font-family: Roboto, Arial, sans-serif;
    `;

    const searchWrapper = document.createElement('div');
    searchWrapper.style.cssText = `
      padding: 10px; border-bottom: 1px solid #dadce0; flex-shrink: 0; background: #fafafa;
    `;

    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = T.searchIcon;
    search.style.cssText = `
      width: 100%; padding: 6px 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px;
      box-sizing: border-box;
    `;

    const iconGrid = document.createElement('div');
    iconGrid.style.cssText = `
      flex: 1; overflow-y: auto; display: grid; padding: 10px;
      grid-template-columns: repeat(auto-fill, 40px); gap: 8px;
    `;

    search.oninput = () => {
      filtered = allIcons.filter(i => i.toLowerCase().includes(search.value.toLowerCase()));
      page = 0;
      while (iconGrid.firstChild) {
        iconGrid.removeChild(iconGrid.firstChild);
      }
      loadNext();
    };

    iconGrid.onscroll = () => {
      if (iconGrid.scrollTop + iconGrid.clientHeight >= iconGrid.scrollHeight - 20) {
        loadNext();
      }
    };

    function loadNext() {
      const next = filtered.slice(page * 50, (page + 1) * 50);
      next.forEach(iconName => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = `
          border: none; background: none; cursor: pointer; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
        `;
        const span = document.createElement('span');
        span.className = 'material-icons';
        span.textContent = iconName;

        btn.appendChild(span);

        btn.onclick = () => {
          targetBtn.dataset.icon = iconName;
          iconSpan.textContent = iconName;
          picker.remove();
        };

        iconGrid.appendChild(btn);
      });
      page++;
    }

    searchWrapper.appendChild(search);
    picker.appendChild(searchWrapper);
    picker.appendChild(iconGrid);
    document.body.appendChild(picker);
    loadNext();
  }

  function createMaterialInput(labelText, id, value, type = 'text') {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-bottom: 20px; text-align: center;';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.style.cssText = 'font-size: 12px; color: #5f6368; display: block; margin-bottom: 4px;';

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.value = value;
    input.style.cssText = `
      width: 100%; padding: 8px; border: 1px solid #dadce0; border-radius: 4px;
      font-size: 14px; box-sizing: border-box; text-align: center; transition: border 0.3s;
    `;
    input.onfocus = () => input.style.border = '1px solid #1a73e8';
    input.onblur = () => input.style.border = '1px solid #dadce0';

    wrapper.append(label, input);
    return wrapper;
  }

  function createMaterialCheckbox(labelText, id, checked) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin-bottom: 20px; text-align: center;';

    const label = document.createElement('label');
    label.style.cssText = 'font-size: 12px; color: #5f6368; display: flex; align-items: center; justify-content: center; gap: 8px;';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = checked;

    label.append(checkbox, labelText);
    wrapper.appendChild(label);
    return wrapper;
  }

  function makeDraggable(toolbar) {
    let offsetX, offsetY, isDragging = false;

    toolbar.addEventListener('mousedown', e => {
      isDragging = true;
      offsetX = e.clientX - toolbar.offsetLeft;
      offsetY = e.clientY - toolbar.offsetTop;
    });

    document.addEventListener('mousemove', e => {
      if (isDragging) {
        toolbar.style.left = `${e.clientX - offsetX}px`;
        toolbar.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        localStorage.setItem('foldToolbarPosition', JSON.stringify({ top: toolbar.style.top, left: toolbar.style.left }));
        isDragging = false;
      }
    });
  }

  function unfoldAll(editor, monaco) {
    try{
        editor.getModel().getAllDecorations().forEach(d => {
            if (d.options.isWholeLine) editor.setHiddenAreas([]);
        });
    }catch(e){
        //console.log(`Erro: ${e}`);
    }
    editor.getAction('editor.unfoldAll').run();
  }

  function foldAll(editor, monaco) {
    editor.getAction('editor.foldAll').run();
  }

  function toggleCurrentBlock(editor, monaco) {
    editor.getAction('editor.toggleFold').run();
  }

  function persistFoldState(editor) {
    const key = `foldState:${location.href}`;
    const model = editor.getModel();
    const fileName = getFileName();

    const state = editor.saveViewState();
    if (state) {
      const key = getStorageKey(projectId, fileName);
      localStorage.setItem(key, JSON.stringify(state));
    }

    const restore = JSON.parse(localStorage.getItem(key)) || [];
    if (restore.length) editor.setHiddenAreas(restore);

    editor.onDidChangeModelContent(() => {
      const folded = editor.getVisibleRanges().length ? [] : editor.getVisibleRanges();
      localStorage.setItem(key, JSON.stringify(editor.getHiddenAreas()));
    });

    editor.onDidChangeHiddenAreas(() => {
      localStorage.setItem(key, JSON.stringify(editor.getHiddenAreas()));
    });
  }

  function startAutoSave() {
    const config = JSON.parse(localStorage.getItem('foldToolbarConfig'));
    if (config?.autoSave) {
      setInterval(() => {
        document.querySelector('[aria-label="Salvar projeto"]')?.click();
      }, config.interval * 1000);
    }
  }

  function addShortcuts(editor, monaco) {
    const config = JSON.parse(localStorage.getItem('foldToolbarConfig'));
    if (!config) return;

    document.addEventListener('keydown', e => {
      if (!e.ctrlKey || !e.altKey) return;

      switch (e.key.toLowerCase()) {
        case config.shortcuts.expand:
          unfoldAll(editor, monaco);
          break;
        case config.shortcuts.fold:
          foldAll(editor, monaco);
          break;
        case config.shortcuts.toggle:
          toggleCurrentBlock(editor, monaco);
          break;
      }
    });
  }

})();
